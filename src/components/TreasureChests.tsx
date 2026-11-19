"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TYPE_LABEL } from "@/lib/catalogue";
import { unlockState, readProgress } from "@/lib/learner-progress";
import { haptic } from "@/lib/haptics";

export type ChestTreasure = {
  slug: string;
  title: string;
  type: string;
  summary: string;
  sensitivity: boolean;
};

type Props = {
  stateSlug: string;
  treasures: ChestTreasure[];
};

export function TreasureChests({ stateSlug, treasures }: Props) {
  const [visited, setVisited] = useState<Set<string>>(new Set());

  useEffect(() => {
    const sync = () => {
      const p = readProgress();
      setVisited(new Set(p.visitedTreasures));
    };
    sync();
    window.addEventListener("pp-progress", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("pp-progress", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (treasures.length > 0) unlockState(stateSlug);
  }, [stateSlug, treasures.length]);

  if (treasures.length === 0) {
    return (
      <div className="rounded-2xl bg-[var(--surface)] px-5 py-6 outline outline-1 outline-[var(--line)]">
        <p className="serif text-xl">Treasures coming soon</p>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          No published cited cards for this place yet. We do not invent entries to fill the map.
          Check the coverage meter on Home, or pick a blue state on the India map.
        </p>
        <Link
          href="/map"
          className="btn mt-4 inline-flex min-h-11 items-center rounded-full bg-[var(--primary)] px-5 text-sm text-[var(--on-primary)]"
        >
          Back to India map
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {treasures.map((t) => {
        const open = visited.has(t.slug);
        return (
          <li key={t.slug}>
            <Link
              href={`/items/${t.slug}`}
              onClick={() => haptic(8)}
              className="group flex h-full flex-col rounded-2xl bg-[var(--surface)] p-5 outline outline-1 outline-[var(--line)] transition-[outline-color] hover:outline-[var(--primary)]"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`grid size-12 shrink-0 place-items-center rounded-xl text-lg ${
                    open
                      ? "bg-[var(--saffron-tint)] text-[var(--saffron-ink)]"
                      : "bg-[var(--primary-tint)] text-[var(--primary-deep)]"
                  }`}
                  aria-hidden
                >
                  {open ? "◇" : "▣"}
                </span>
                <span className="text-xs font-medium text-[var(--muted)]">
                  {open ? "Stamped" : "Preview"}
                </span>
              </div>
              <h3 className="serif mt-3 text-xl group-hover:text-[var(--primary)]">{t.title}</h3>
              <p className="mt-1 text-xs font-medium text-[var(--primary)]">
                {TYPE_LABEL[t.type as keyof typeof TYPE_LABEL] ?? t.type}
              </p>
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--ink-soft)]">
                {t.summary}
              </p>
              {t.sensitivity ? (
                <p className="mt-3 text-xs font-medium text-[var(--ink)]">
                  Handle with care · teach, do not trespass
                </p>
              ) : null}
              <span className="mt-4 text-sm font-medium text-[var(--primary)]">
                {open ? "Revisit treasure" : "Open treasure"} →
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
