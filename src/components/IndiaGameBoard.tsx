"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/components/LanguageToggle";
import {
  getStateBySlug,
  getStateBySvgId,
  INDIA_STATES,
  type IndiaState,
} from "@/lib/india-states";
import { unlockState, readProgress, type LearnerProgress } from "@/lib/learner-progress";
import { haptic } from "@/lib/haptics";
import { TYPE_LABEL } from "@/lib/catalogue";
import { t } from "@/lib/i18n";

export type BoardTreasure = {
  slug: string;
  title: string;
  type: string;
  regionSlug: string;
};

type Props = {
  coveredSlugs: string[];
  cardCountByState: Record<string, number>;
  treasuresByState: Record<string, BoardTreasure[]>;
  initialStateSlug?: string | null;
};

const FILL = {
  unlocked: "#c4782a",
  available: "#5b6aa8",
  empty: "#c8c2b6",
  hover: "#9a3412",
  stroke: "#f7f2e8",
} as const;

function stateFill(
  slug: string,
  unlocked: Set<string>,
  covered: Set<string>,
): string {
  if (unlocked.has(slug)) return FILL.unlocked;
  if (covered.has(slug)) return FILL.available;
  return FILL.empty;
}

export function IndiaGameBoard({
  coveredSlugs,
  cardCountByState,
  treasuresByState,
  initialStateSlug,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<IndiaState | null>(() =>
    initialStateSlug ? (getStateBySlug(initialStateSlug) ?? null) : null,
  );
  const [progress, setProgress] = useState<LearnerProgress | null>(null);
  const [lang] = useLang();

  const covered = useMemo(() => new Set(coveredSlugs), [coveredSlugs]);

  const unlockedSet = useMemo(
    () => new Set(progress?.unlockedStates ?? []),
    [progress],
  );

  const paint = useCallback(() => {
    const root = hostRef.current;
    if (!root) return;
    const unlocked = new Set(readProgress().unlockedStates);
    for (const state of INDIA_STATES) {
      const path = root.querySelector(`#${state.svgId}`) as SVGPathElement | null;
      if (!path) continue;
      path.style.fill = stateFill(state.slug, unlocked, covered);
      path.style.stroke = FILL.stroke;
      path.style.strokeWidth = "0.8";
      path.style.cursor = "pointer";
      path.style.transition = "fill 180ms ease, opacity 180ms ease";
      path.setAttribute("tabindex", "0");
      path.setAttribute("role", "button");
      path.setAttribute(
        "aria-label",
        `${state.name}${covered.has(state.slug) ? `, ${cardCountByState[state.slug] ?? 0} treasures` : ", cards coming soon"}`,
      );
    }
  }, [cardCountByState, covered]);

  useEffect(() => {
    const sync = () => {
      setProgress(readProgress());
      paint();
    };
    sync();
    window.addEventListener("pp-progress", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("pp-progress", sync);
      window.removeEventListener("storage", sync);
    };
  }, [paint]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/india-states.svg", { cache: "force-cache" });
        if (!res.ok) throw new Error("Map file missing");
        const raw = await res.text();
        if (cancelled || !hostRef.current) return;
        hostRef.current.innerHTML = raw;
        const svg = hostRef.current.querySelector("svg");
        if (!svg) throw new Error("Invalid map SVG");
        svg.removeAttribute("width");
        svg.removeAttribute("height");
        if (!svg.getAttribute("viewBox") && svg.getAttribute("viewbox")) {
          svg.setAttribute("viewBox", svg.getAttribute("viewbox")!);
        }
        svg.setAttribute("class", "h-auto w-full");
        svg.setAttribute("role", "img");
        svg.setAttribute(
          "aria-label",
          "Interactive map of India. Select a state or union territory to unlock treasures.",
        );
        paint();
        setReady(true);
      } catch {
        if (!cancelled) setLoadError("India map could not load. Use the list of states below.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [paint]);

  useEffect(() => {
    const root = hostRef.current;
    if (!root || !ready) return;

    const onActivate = (svgId: string) => {
      const state = getStateBySvgId(svgId);
      if (!state) return;
      haptic(8);
      setSelected(state);
      if (covered.has(state.slug)) {
        unlockState(state.slug);
      }
      paint();
    };

    const onClick = (e: Event) => {
      const t = e.target as Element | null;
      const path = t?.closest?.("path[id]");
      if (!path) return;
      onActivate(path.id);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const t = e.target as Element | null;
      if (!t || t.tagName.toLowerCase() !== "path" || !t.id) return;
      e.preventDefault();
      onActivate(t.id);
    };

    root.addEventListener("click", onClick);
    root.addEventListener("keydown", onKey as EventListener);
    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKey as EventListener);
    };
  }, [covered, paint, ready]);

  const treasures = selected ? (treasuresByState[selected.slug] ?? []) : [];
  const isCovered = selected ? covered.has(selected.slug) : false;
  const isUnlocked = selected ? unlockedSet.has(selected.slug) : false;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 text-xs text-[var(--ink-soft)]">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm" style={{ background: FILL.unlocked }} />
          {t(lang, "legendUnlocked")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm" style={{ background: FILL.available }} />
          {t(lang, "legendReady")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm" style={{ background: FILL.empty }} />
          {t(lang, "legendComing")}
        </span>
      </div>

      {loadError ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {loadError}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)]">
        <div
          ref={hostRef}
          className="overflow-hidden rounded-2xl bg-[oklch(0.94_0.02_85)] p-2 outline outline-1 outline-[var(--line)] sm:p-3 [&_path:focus-visible]:outline [&_path:focus-visible]:outline-2 [&_path:focus-visible]:outline-[var(--primary)]"
        />

        <aside className="page-panel flex flex-col p-5" aria-live="polite">
          {selected ? (
            <>
              <p className="text-xs font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
                {isUnlocked ? "Unlocked" : isCovered ? "Ready to explore" : "Not yet in catalogue"}
              </p>
              <h2 className="serif mt-2 text-2xl">{selected.name}</h2>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">
                {isCovered
                  ? `${cardCountByState[selected.slug] ?? treasures.length} cited treasure${(cardCountByState[selected.slug] ?? treasures.length) === 1 ? "" : "s"} in this place.`
                  : "No published cards here yet. Breadth rollout continues state by state , no invented entries."}
              </p>

              {treasures.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {treasures.slice(0, 4).map((t) => (
                    <li key={t.slug}>
                      <Link
                        href={`/items/${t.slug}`}
                        className="flex min-h-12 items-start gap-2 rounded-xl bg-[var(--bg)] px-3 py-2.5 outline outline-1 outline-[var(--line)] hover:outline-[var(--primary)]"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium text-[var(--ink)]">{t.title}</span>
                          <span className="mt-0.5 block text-xs text-[var(--muted)]">
                            {TYPE_LABEL[t.type as keyof typeof TYPE_LABEL] ?? t.type}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}

              <Link
                href={`/places/${selected.slug}`}
                className="btn mt-4 inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--primary)] px-5 text-[var(--on-primary)]"
              >
                Open place hub
              </Link>

              {isCovered && !isUnlocked ? (
                <button
                  type="button"
                  className="btn mt-2 min-h-11 rounded-full border border-[var(--line-strong)] px-5 text-sm"
                  onClick={() => {
                    unlockState(selected.slug);
                    haptic(10);
                    paint();
                    setProgress(readProgress());
                  }}
                >
                  Stamp this state
                </button>
              ) : null}
            </>
          ) : (
            <>
              <p className="text-xs font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
                India game board
              </p>
              <h2 className="serif mt-2 text-2xl">Pick a state</h2>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">
                Tap a state or UT. Places with cited cards unlock into your passport. Empty regions
                stay honest: coming soon, not filled with guesswork.
              </p>
            </>
          )}
        </aside>
      </div>

      <section aria-labelledby="state-list-heading">
        <h2 id="state-list-heading" className="serif text-xl">
          All states & UTs
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {INDIA_STATES.map((s) => {
            const count = cardCountByState[s.slug] ?? 0;
            const unlocked = unlockedSet.has(s.slug);
            return (
              <li key={s.slug}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(s);
                    if (covered.has(s.slug)) unlockState(s.slug);
                    haptic(8);
                    paint();
                    setProgress(readProgress());
                  }}
                  className="flex w-full min-h-12 items-center justify-between gap-2 rounded-xl bg-[var(--surface)] px-3 py-2.5 text-left text-sm outline outline-1 outline-[var(--line)] hover:outline-[var(--primary)]"
                >
                  <span className="font-medium">{s.name}</span>
                  <span className="shrink-0 text-xs text-[var(--muted)]">
                    {unlocked ? "Unlocked" : count > 0 ? `${count} cards` : "Soon"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
