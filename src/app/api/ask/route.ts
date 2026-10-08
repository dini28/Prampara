import { NextResponse } from "next/server";
import { groundedAnswer } from "@/lib/retrieval";
import { logAsk } from "@/lib/runtime-store";

const buckets = new Map<string, { n: number; t: number }>();

function limited(ip: string) {
  const now = Date.now();
  const row = buckets.get(ip) ?? { n: 0, t: now };
  if (now - row.t > 60_000) {
    row.n = 0;
    row.t = now;
  }
  row.n += 1;
  buckets.set(ip, row);
  return row.n > 30;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  if (limited(ip)) {
    return NextResponse.json({ error: "Rate limit" }, { status: 429 });
  }
  const body = (await request.json()) as { question?: string; itemSlug?: string };
  const question = (body.question ?? "").trim();
  if (question.length < 8) {
    return NextResponse.json({ error: "Ask a fuller question." }, { status: 400 });
  }

  const result = groundedAnswer(question, body.itemSlug);
  logAsk({ itemSlug: body.itemSlug, question, refused: result.refused });
  return NextResponse.json(result);
}
