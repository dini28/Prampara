"use client";

import { useMemo, useState } from "react";
import { PhotoUnderstand } from "@/components/PhotoUnderstand";

export function AskBox({ slug }: { slug: string }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    refused: boolean;
    answer: string;
    sources: { title: string; url: string; publisher: string | null }[];
  } | null>(null);

  const demo = useMemo(
    () => [
      "Who keeps this practice, according to the card?",
      "What must this app refuse to invent?",
      "Exact visarjan minute tomorrow?",
    ],
    [],
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemSlug: slug, question }),
      });
      const data = await res.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-[var(--bg)] p-6 shadow-[var(--shadow)] outline outline-1 outline-[var(--line)]">
        <h2 className="serif text-3xl">Ask (answers only from the card)</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
          Answers come only from the cards and link to their sources. If the cards do not cover your
          question, you will see a clear “Not covered by the cards” badge instead of a guess.
        </p>
        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <textarea
            required
            minLength={8}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            className="w-full rounded-xl bg-[var(--bg)] p-4 text-[var(--ink)] outline outline-1 outline-[var(--line-strong)] placeholder:text-[var(--muted)]"
            placeholder="Ask about this card…"
          />
          <div className="flex flex-wrap gap-2">
            {demo.map((d) => (
              <button
                key={d}
                type="button"
                className="min-h-10 rounded-full bg-[var(--surface)] px-3 py-1 text-left text-xs text-[var(--ink)] outline outline-1 outline-[var(--line)] hover:outline-[var(--primary)]"
                onClick={() => setQuestion(d)}
              >
                {d}
              </button>
            ))}
          </div>
          <button
            disabled={loading}
            className="btn min-h-12 rounded-full bg-[var(--primary)] px-5 text-sm font-medium text-[var(--on-primary)] hover:bg-[var(--primary-hover)] disabled:opacity-70"
            type="submit"
          >
            {loading ? "Retrieving…" : "Ask from cards"}
          </button>
        </form>
        {result ? (
          <div
            className={`mt-5 rounded-xl p-4 outline outline-1 outline-[var(--line)] ${
              result.refused ? "bg-[var(--surface)]" : "bg-[var(--verified-tint)]"
            }`}
          >
            <p
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                result.refused
                  ? "bg-[var(--bg)] text-[var(--ink-soft)] outline outline-1 outline-[var(--line)]"
                  : "bg-[var(--verified)] text-white"
              }`}
            >
              {result.refused ? "Not covered by the cards" : "Answered from the cards"}
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{result.answer}</p>
            {result.sources?.length ? (
              <ul className="mt-3 space-y-1 text-xs">
                {result.sources.map((s) => (
                  <li key={s.url}>
                    <a
                      className="text-[var(--primary)] underline"
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
      <PhotoUnderstand />
    </div>
  );
}
