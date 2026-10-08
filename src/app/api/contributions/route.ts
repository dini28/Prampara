import { NextResponse } from "next/server";
import { getItemBySlug } from "@/lib/catalogue";
import { addContribution } from "@/lib/runtime-store";
import { getLearnerName } from "@/lib/learner";

export async function POST(request: Request) {
  const body = (await request.json()) as { itemSlug?: string; body?: string };
  const text = (body.body ?? "").trim();
  const item = body.itemSlug ? getItemBySlug(body.itemSlug) : undefined;
  if (!item || text.length < 40) {
    return NextResponse.json(
      { message: "Need a real memory (40+ characters) on a known card." },
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
