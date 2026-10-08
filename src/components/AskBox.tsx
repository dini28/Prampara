"use client";

import { useMemo, useState } from "react";

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
    <div className="rounded-[32px] bg-[var(--indigo)] p-6 text-[var(--paper)] shadow-[var(--shadow)]">
      <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">Grounded Ask</p>
      <h2 className="serif mt-2 text-3xl">Cite or refuse</h2>
      <p className="mt-2 text-sm text-[oklch(0.93_0.03_80)]">
        Answers come only from retrieved cards. Weak retrieval returns a refuse template.
      </p>
      <form onSubmit={onSubmit} className="mt-5 space-y-3">
        <textarea
          required
          minLength={8}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={4}
          className="w-full rounded-2xl border-0 bg-[oklch(0.98_0.02_80)] p-4 text-[var(--ink)] outline-none"
          placeholder="Ask about this card…"
        />
        <div className="flex flex-wrap gap-2">
          {demo.map((d) => (
            <button
              key={d}
              type="button"
              className="rounded-full bg-[oklch(1_0_0_/_0.08)] px-3 py-1 text-left text-xs"
              onClick={() => setQuestion(d)}
            >
              {d}
            </button>
          ))}
        </div>
        <button
          disabled={loading}
          className="btn rounded-full bg-[var(--accent)] px-5 py-2 text-sm text-[var(--on-primary)]"
          type="submit"
        >
          {loading ? "Retrieving…" : "Ask from cards"}
        </button>
      </form>
      {result ? (
        <div className="mt-5 rounded-2xl bg-[oklch(1_0_0_/_0.08)] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]">
            {result.refused ? "Refused" : "Grounded"}
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{result.answer}</p>
          {result.sources?.length ? (
            <ul className="mt-3 space-y-1 text-xs">
              {result.sources.map((s) => (
                <li key={s.url}>
                  <a className="underline" href={s.url} target="_blank" rel="noreferrer">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
