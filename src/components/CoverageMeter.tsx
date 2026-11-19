"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/LanguageToggle";
import { INDIA_STATE_COUNT } from "@/lib/india-states";
import { t, tFill } from "@/lib/i18n";
import { readProgress, type LearnerProgress } from "@/lib/learner-progress";

type Props = {
  catalogueCovered: number;
  compact?: boolean;
};

export function CoverageMeter({ catalogueCovered, compact }: Props) {
  const [progress, setProgress] = useState<LearnerProgress | null>(null);
  const [lang] = useLang();

  useEffect(() => {
    const sync = () => setProgress(readProgress());
    sync();
    window.addEventListener("pp-progress", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("pp-progress", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const unlocked = progress?.unlockedStates.length ?? 0;
  const cataloguePct = Math.round((catalogueCovered / INDIA_STATE_COUNT) * 100);
  const unlockPct = Math.round((unlocked / INDIA_STATE_COUNT) * 100);

  return (
    <div
      className={compact ? "space-y-3" : "page-panel space-y-4 p-5 sm:p-6"}
      aria-label={t(lang, "coverageTitle")}
    >
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
            {t(lang, "coverageTitle")}
          </p>
          {!compact ? (
            <p className="mt-1 text-sm text-[var(--ink-soft)]">
              {tFill(lang, "coverageLead", {
                covered: catalogueCovered,
                total: INDIA_STATE_COUNT,
              })}
            </p>
          ) : null}
        </div>
        <p className="serif text-2xl tabular-nums text-[var(--primary-deep)]">
          {catalogueCovered}
          <span className="text-base text-[var(--muted)]"> / {INDIA_STATE_COUNT}</span>
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-[var(--muted)]">
          <span>{t(lang, "catalogueBreadth")}</span>
          <span className="tabular-nums">{cataloguePct}%</span>
        </div>
        <div
          className="h-2.5 overflow-hidden rounded-full bg-[var(--surface)] outline outline-1 outline-[var(--line)]"
          role="progressbar"
          aria-valuenow={catalogueCovered}
          aria-valuemin={0}
          aria-valuemax={INDIA_STATE_COUNT}
          aria-label={t(lang, "catalogueBreadth")}
        >
          <div
            className="h-full rounded-full bg-[var(--primary)] transition-[width] duration-500"
            style={{ width: `${cataloguePct}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-[var(--muted)]">
          <span>{t(lang, "unlockedStates")}</span>
          <span className="tabular-nums">
            {unlocked} · {unlockPct}%
          </span>
        </div>
        <div
          className="h-2.5 overflow-hidden rounded-full bg-[var(--surface)] outline outline-1 outline-[var(--line)]"
          role="progressbar"
          aria-valuenow={unlocked}
          aria-valuemin={0}
          aria-valuemax={INDIA_STATE_COUNT}
          aria-label={t(lang, "unlockedStates")}
        >
          <div
            className="h-full rounded-full bg-[var(--saffron)] transition-[width] duration-500"
            style={{ width: `${Math.max(unlockPct, unlocked > 0 ? 2 : 0)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
