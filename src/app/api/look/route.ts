import { matchMeanings } from "@/lib/destinations";
import { clientIp, isRateLimited } from "@/lib/rate-limit";
import { appendLookFeedback } from "@/lib/runtime-store";
import { NextResponse } from "next/server";

const MAX_BYTES = 1_200_000; // ~1.2MB after client resize

/**
 * Photo understanding: never stores the image by default.
 * Explanations come only from Meaning / card sources. No invented ritual detail.
 */
export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  if (isRateLimited(`look:${ip}`, 20, 60_000)) {
    return NextResponse.json({ error: "Rate limit" }, { status: 429 });
  }

  let body: {
    hint?: string;
    destinationSlug?: string;
    feedback?: "yes" | "no" | "not_sure";
    meaningSlug?: string;
    hasImage?: boolean;
    imageBytesApprox?: number;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.feedback && body.meaningSlug) {
    appendLookFeedback({
      meaningSlug: body.meaningSlug,
      feedback: body.feedback,
      destinationSlug: body.destinationSlug,
    });
    return NextResponse.json({ ok: true, stored: "feedback_only" });
  }

  if (body.imageBytesApprox && body.imageBytesApprox > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image too large. Please use JPG, PNG, or WebP under the size limit after resize." },
      { status: 413 },
    );
  }

  const hint = (body.hint ?? "").trim();
  const locationUsed = Boolean(body.destinationSlug);
  const matches = matchMeanings({
    hint: hint || undefined,
    destinationSlug: body.destinationSlug,
    limit: 4,
  });

  if (!matches.length || matches[0].confidence === "Low" && matches[0].score < 3) {
    const alternatives = matchMeanings({
      destinationSlug: body.destinationSlug,
      limit: 4,
    }).map((m) => ({
      slug: m.meaning.slug,
      name: m.meaning.name,
      type: m.meaning.object_type,
      confidence: "Low" as const,
    }));

    return NextResponse.json({
      unsure: true,
      message:
        "We are not sure what this is. Confirm or type what you think it is. We will only explain from cited meanings and cards.",
      locationUsed,
      locationNote: locationUsed
        ? `Location (${body.destinationSlug}) was used to narrow nearby meanings.`
        : "No place was selected, so matches are broader and lower confidence.",
      consentNote: "Your photo is used only to explain this object. It is not stored by default. Faces are ignored.",
      alternatives,
      askConfirm: true,
    });
  }

  const top = matches[0];
  const meaning = top.meaning;

  return NextResponse.json({
    unsure: top.confidence !== "High",
    confidence: top.confidence,
    locationUsed,
    locationNote: locationUsed
      ? `Location (${body.destinationSlug}) helped narrow this guess.`
      : "No place context was provided.",
    consentNote: "Your photo is used only to explain this object. It is not stored by default. Faces are ignored.",
    match: {
      slug: meaning.slug,
      name: meaning.name,
      type: meaning.object_type,
      symbolises: meaning.symbolises,
      community_context: meaning.community_context,
      sentiment: meaning.sentiment,
      sensitivity_flag: Boolean(meaning.sensitivity_flag),
      sources: meaning.sources,
      related_place_slugs: meaning.related_place_slugs ?? [],
      related_card_slugs: meaning.related_card_slugs ?? [],
    },
    alternatives: matches.slice(1).map((m) => ({
      slug: m.meaning.slug,
      name: m.meaning.name,
      type: m.meaning.object_type,
      confidence: m.confidence,
    })),
    learnMore:
      meaning.related_card_slugs?.[0]
        ? `/items/${meaning.related_card_slugs[0]}`
        : meaning.related_place_slugs?.[0]
          ? `/places/${body.destinationSlug ?? "udaipur"}#place-${meaning.related_place_slugs[0]}`
          : "/map",
  });
}
