"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "pp_onboard_v2_dismissed";

const SLIDES = [
  {
    title: "Start with a place",
    body: "Say where you are, or search a city. We open the state culture story first, then your city.",
  },
  {
    title: "Read layers, not a dump",
    body: "Heritage route, food, travel, and a Heritage | Modern toggle. Every item cites sources.",
  },
  {
    title: "Finish the 8 minute loop",
    body: "Open a cited card, Ask (answers only from the card), take a quiz, optionally contribute a note for human review.",
  },
];

export function OnboardingSlides() {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.localStorage.getItem(KEY)) setOpen(true);
  }, []);

  if (!open) return null;
  const slide = SLIDES[i];

  function dismiss() {
    window.localStorage.setItem(KEY, "1");
    setOpen(false);
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[oklch(0.2_0.04_275/0.45)] p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboard-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-[var(--bg)] p-6 shadow-[var(--shadow)] outline outline-1 outline-[var(--line)]">
        <p className="text-xs font-semibold tracking-wide text-[var(--primary)] uppercase">
          Welcome · {i + 1} / {SLIDES.length}
        </p>
        <h2 id="onboard-title" className="serif mt-2 text-2xl">
          {slide.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">{slide.body}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {i < SLIDES.length - 1 ? (
            <button
              type="button"
              className="btn min-h-12 rounded-full bg-[var(--primary)] px-5 text-sm text-[var(--on-primary)]"
              onClick={() => setI((n) => n + 1)}
            >
              Next
            </button>
          ) : (
            <Link
              href="/items/kalbelia"
              className="btn inline-flex min-h-12 items-center rounded-full bg-[var(--primary)] px-5 text-sm text-[var(--on-primary)]"
              onClick={dismiss}
            >
              Try the 8 minute demo
            </Link>
          )}
          <button
            type="button"
            className="btn min-h-12 rounded-full border border-[var(--line-strong)] px-5 text-sm"
            onClick={dismiss}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
