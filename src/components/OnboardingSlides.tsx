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
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[oklch(0.2_0.04_275/0.4)] p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboard-title"
    >
      <div className="w-full max-w-md rounded-[16px] bg-[var(--bg)] p-5 shadow-[0_-8px_40px_oklch(0.25_0.04_275/0.18)] outline outline-1 outline-[var(--line)] sm:rounded-2xl sm:p-6 sm:shadow-[var(--shadow)]">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--line-strong)] sm:hidden" aria-hidden="true" />
        <p className="text-[13px] font-semibold tracking-[0.02em] text-[var(--primary)]">
          Welcome · {i + 1} / {SLIDES.length}
        </p>
        <h2 id="onboard-title" className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)] sm:serif sm:text-2xl">
          {slide.title}
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink-soft)]">{slide.body}</p>
        <div className="mt-5 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:flex-wrap sm:gap-3">
          {i < SLIDES.length - 1 ? (
            <button
              type="button"
              className="btn min-h-12 w-full rounded-full bg-[var(--primary)] px-5 text-[15px] font-semibold text-[var(--on-primary)] sm:w-auto"
              onClick={() => setI((n) => n + 1)}
            >
              Continue
            </button>
          ) : (
            <Link
              href="/items/kalbelia"
              className="btn inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--primary)] px-5 text-[15px] font-semibold text-[var(--on-primary)] sm:w-auto"
              onClick={dismiss}
            >
              Try the 8 minute demo
            </Link>
          )}
          <button
            type="button"
            className="btn min-h-12 w-full rounded-full text-[15px] font-medium text-[var(--primary)] sm:w-auto sm:border sm:border-[var(--line-strong)] sm:px-5 sm:text-[var(--ink)]"
            onClick={dismiss}
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
