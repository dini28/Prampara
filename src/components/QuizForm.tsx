"use client";

import { useState } from "react";
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
    await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemSlug, quizId: quiz.id, score: correct, total: quiz.questions.length }),
    });
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {quiz.questions.map((q, i) => (
        <fieldset key={q.id} className="rounded-[28px] bg-[var(--paper-2)] p-5 outline outline-1 outline-[var(--line)]">
          <legend className="serif px-1 text-xl">
            {i + 1}. {q.prompt}
          </legend>
          <div className="mt-4 space-y-2">
            {q.options.map((opt, idx) => (
              <label key={opt} className="flex cursor-pointer items-start gap-3 text-sm">
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
      <button className="btn rounded-full bg-[var(--terracotta)] px-6 py-2 text-[var(--paper)]" type="submit">
        Score this path
      </button>
      {score !== null ? (
        <p className="serif text-2xl">
          {score} / {quiz.questions.length}
        </p>
      ) : null}
    </form>
  );
}
