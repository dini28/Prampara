import { NextResponse } from "next/server";
import { getItemBySlug } from "@/lib/catalogue";
import { getLearnerName } from "@/lib/learner";
import { saveQuizProgress } from "@/lib/runtime-store";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    itemSlug?: string;
    quizId?: string;
    score?: number;
    total?: number;
  };
  const item = body.itemSlug ? getItemBySlug(body.itemSlug) : undefined;
  if (!item) {
    return NextResponse.json({ error: "Unknown card" }, { status: 404 });
  }
  const learner = (await getLearnerName()) ?? "guest";
  saveQuizProgress({
    itemSlug: item.slug,
    quizId: body.quizId ?? item.quiz.id,
    score: body.score ?? 0,
    total: body.total ?? item.quiz.questions.length,
    learner,
  });
  return NextResponse.json({ ok: true, score: body.score, total: body.total });
}
