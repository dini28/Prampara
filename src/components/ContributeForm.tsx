"use client";

import { useState } from "react";

export function ContributeForm({ slug }: { slug: string }) {
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/contributions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemSlug: slug, body }),
    });
    const data = await res.json();
    setStatus(data.message ?? (res.ok ? "Submitted as pending." : "Could not submit."));
    if (res.ok) setBody("");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <p className="text-sm leading-relaxed text-[var(--ink-soft)]">
        Family or field notes stay <strong className="text-[var(--ink)]">unpublished</strong> until a
        reviewer accepts them in Admin. Do not include closed or sacred instructions, or other
        people’s photos without consent.
      </p>
      <textarea
        required
        minLength={40}
        rows={8}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full rounded-xl bg-[var(--surface)] p-4 outline outline-1 outline-[var(--line)]"
        placeholder="A memory tied to this practice, with place and year if you have them…"
      />
      <button
        className="btn min-h-11 rounded-full bg-[var(--primary)] px-5 text-sm text-[var(--on-primary)] hover:bg-[var(--primary-hover)]"
        type="submit"
      >
        Queue for review
      </button>
      {status ? (
        <p className="text-sm text-[var(--verified)]" role="status">
          {status}
        </p>
      ) : null}
    </form>
  );
}
