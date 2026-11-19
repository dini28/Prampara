"use client";

import Link from "next/link";
import { useState } from "react";
import { addQuizStamp } from "@/lib/learner-progress";
import type { Quiz } from "@/lib/types";

export function QuizForm({ quiz, itemSlug }: { quiz: Quiz; itemSlug: string }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [score, setScore] = useState<number | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    let correct = 0;
    for (const q of quiz.questions) {
      if (answers[q.id] === q.answer_index) correct += 1;
    }
    setScore(correct);
    addQuizStamp(itemSlug);
    await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemSlug,
        quizId: quiz.id,
        score: correct,
        total: quiz.questions.length,
      }),
    });
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {quiz.questions.map((q, i) => (
        <fieldset
          key={q.id}
          className="rounded-2xl bg-[var(--paper-2)] p-5 outline outline-1 outline-[var(--line)]"
        >
          <legend className="serif px-1 text-xl">
            {i + 1}. {q.prompt}
          </legend>
          <div className="mt-4 space-y-2">
            {q.options.map((opt, idx) => (
              <label key={opt} className="flex min-h-11 cursor-pointer items-start gap-3 text-sm">
                <input
                  type="radio"
                  name={q.id}
                  required
                  className="mt-1"
                  checked={answers[q.id] === idx}
                  onChange={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
          {score !== null ? (
            <p className="mt-3 text-sm text-[var(--ink-soft)]">{q.explanation}</p>
          ) : null}
        </fieldset>
      ))}
      <button
        className="btn min-h-12 rounded-full bg-[var(--primary)] px-6 text-[var(--on-primary)]"
        type="submit"
      >
        Score this path
      </button>
      {score !== null ? (
        <div className="space-y-4">
          <p className="serif text-3xl">
            {score} / {quiz.questions.length}
          </p>
          <div>
            <h3 className="serif text-xl">What next?</h3>
            <ul className="mt-3 grid gap-3 sm:grid-cols-3">
              <li>
                <Link
                  href={`/items/${itemSlug}`}
                  className="page-panel flex min-h-24 flex-col justify-center p-4 hover:outline-[var(--primary)]"
                >
                  <span className="font-medium">Review the card</span>
                  <span className="mt-1 text-xs text-[var(--muted)]">Re-read sources</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/places/udaipur"
                  className="page-panel flex min-h-24 flex-col justify-center p-4 hover:outline-[var(--primary)]"
                >
                  <span className="font-medium">Try a nearby place</span>
                  <span className="mt-1 text-xs text-[var(--muted)]">Udaipur pilot route</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/items/${itemSlug}/contribute`}
                  className="page-panel flex min-h-24 flex-col justify-center p-4 hover:outline-[var(--primary)]"
                >
                  <span className="font-medium">Contribute a note</span>
                  <span className="mt-1 text-xs text-[var(--muted)]">Human review first</span>
                </Link>
              </li>
            </ul>
          </div>
          <Link
            href={`/items/${itemSlug}/contribute`}
            className="btn inline-flex min-h-12 items-center rounded-full bg-[var(--primary)] px-6 text-[var(--on-primary)]"
          >
            Finish: Share a note
          </Link>
        </div>
      ) : null}
    </form>
  );
}
