import { NextResponse } from "next/server";
import { getItemBySlug } from "@/lib/catalogue";
import { addContribution } from "@/lib/runtime-store";
import { getLearnerName } from "@/lib/learner";
import { validateContributionBody } from "@/lib/validate";

export async function POST(request: Request) {
  const body = (await request.json()) as { itemSlug?: string; body?: string };
  const text = (body.body ?? "").trim();
  const item = body.itemSlug ? getItemBySlug(body.itemSlug) : undefined;
  const issues = validateContributionBody(text);
  if (!item || issues.length) {
    return NextResponse.json(
      { message: issues[0]?.message ?? "Need a real memory on a known card." },
      { status: 400 },
    );
  }

  const learner = (await getLearnerName()) ?? "guest";
  addContribution({
    itemSlug: item.slug,
    body: text,
    guestLabel: learner,
  });

  return NextResponse.json({
    message: "Queued locally as pending. A reviewer must accept it before it is public.",
  });
}
