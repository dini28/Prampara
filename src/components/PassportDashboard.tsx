"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PassportStamps } from "@/components/PassportStamps";
import { computeBadges, dailyDiscoverSlug } from "@/lib/badges";
import { getStateBySlug } from "@/lib/india-states";
import { readProgress, type LearnerProgress } from "@/lib/learner-progress";
import { HERITAGE_TRAILS, trailProgress } from "@/lib/trails";

type TreasureMeta = { slug: string; title: string };

type Props = {
  treasureTitles: Record<string, string>;
  catalogueSlugs: string[];
  discoverFallback: TreasureMeta | null;
};

export function PassportDashboard({
  treasureTitles,
  catalogueSlugs,
  discoverFallback,
}: Props) {
  const [progress, setProgress] = useState<LearnerProgress | null>(null);

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

  const badges = useMemo(
    () => (progress ? computeBadges(progress) : []),
    [progress],
  );
  const earnedCount = badges.filter((b) => b.earned).length;

  const discoverSlug = progress
    ? dailyDiscoverSlug(progress, catalogueSlugs)
    : discoverFallback?.slug ?? null;
  const discoverTitle = discoverSlug
    ? (treasureTitles[discoverSlug] ?? discoverFallback?.title ?? discoverSlug)
    : null;

  if (!progress) {
    return <p className="text-sm text-[var(--muted)]">Loading passport…</p>;
  }

  const states = progress.unlockedStates
    .map((slug) => getStateBySlug(slug))
    .filter(Boolean);

  return (
    <div className="space-y-12">
      <section
        className="grid gap-4 sm:grid-cols-3"
        aria-label="Passport summary"
      >
        <div className="page-panel p-5">
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
            States unlocked
          </p>
          <p className="serif mt-2 text-3xl tabular-nums">{progress.unlockedStates.length}</p>
        </div>
        <div className="page-panel p-5">
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
            Treasures visited
          </p>
          <p className="serif mt-2 text-3xl tabular-nums">{progress.visitedTreasures.length}</p>
        </div>
        <div className="page-panel p-5">
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
            Gentle streak
          </p>
          <p className="serif mt-2 text-3xl tabular-nums">
            {progress.gentleStreakDays}
            <span className="text-base text-[var(--muted)]"> days</span>
          </p>
          <p className="mt-2 text-xs text-[var(--ink-soft)]">
            Soft reminder only. Missing a day never resets your stamps.
          </p>
        </div>
      </section>

      {discoverSlug && discoverTitle ? (
        <section
          className="rounded-2xl bg-[var(--primary-tint)] px-5 py-5 outline outline-1 outline-[var(--primary)]/15"
          aria-labelledby="daily-discover"
        >
          <h2 id="daily-discover" className="serif text-xl text-[var(--primary-deep)]">
            Today&apos;s gentle discover
          </h2>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            One suggestion for whenever you have a few minutes. Optional.
          </p>
          <Link
            href={`/items/${discoverSlug}`}
            className="btn mt-4 inline-flex min-h-11 items-center rounded-full bg-[var(--primary)] px-5 text-sm text-[var(--on-primary)]"
          >
            Open {discoverTitle}
          </Link>
        </section>
      ) : null}

      <PassportStamps />

      <section aria-labelledby="unlocked-states">
        <h2 id="unlocked-states" className="serif text-2xl">
          Unlocked states
        </h2>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          {states.length === 0
            ? "Open a treasure or stamp a state on the map to fill your passport."
            : `${states.length} place${states.length === 1 ? "" : "s"} stamped on this device.`}
        </p>
        {states.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {states.map((s) =>
              s ? (
                <li key={s.slug}>
                  <Link
                    href={`/places/${s.slug}`}
                    className="inline-flex min-h-10 items-center rounded-full bg-[var(--saffron-tint)] px-4 text-sm text-[var(--saffron-ink)]"
                  >
                    {s.name}
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        ) : (
          <Link
            href="/map"
            className="btn mt-4 inline-flex min-h-11 items-center rounded-full bg-[var(--primary)] px-5 text-sm text-[var(--on-primary)]"
          >
            Open India map
          </Link>
        )}
      </section>

      <section aria-labelledby="badges-heading">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 id="badges-heading" className="serif text-2xl">
            Badge legends
          </h2>
          <p className="text-sm tabular-nums text-[var(--muted)]">
            {earnedCount} / {badges.length}
          </p>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-soft)]">
          Soft goals that feed your stamp page. Locked badges stay invitational, never shaming.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((b) => (
            <li
              key={b.id}
              className={`rounded-2xl p-4 outline outline-1 ${
                b.earned
                  ? "bg-[var(--saffron-tint)] outline-[var(--saffron)]/30"
                  : "bg-[var(--surface)] outline-[var(--line)]"
              }`}
            >
              <p className="text-xs font-semibold tracking-wide uppercase text-[var(--muted)]">
                {b.earned ? "Earned" : "Still open"}
              </p>
              <h3 className="serif mt-1 text-lg">{b.title}</h3>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">
                {b.earned ? b.description : b.hint}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="trails-heading">
        <h2 id="trails-heading" className="serif text-2xl">
          Themed trails
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-soft)]">
          Short paths across cited cards. Finish by visiting each treasure. No trespass framing.
        </p>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {HERITAGE_TRAILS.map((trail) => {
            const tp = trailProgress(trail, progress.visitedTreasures);
            const pct = Math.round((tp.done / tp.total) * 100);
            return (
              <li key={trail.id} className="page-panel flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="serif text-xl">{trail.title}</h3>
                  <span className="text-xs tabular-nums text-[var(--muted)]">
                    {tp.done}/{tp.total}
                  </span>
                </div>
                <p className="mt-2 flex-1 text-sm text-[var(--ink-soft)]">{trail.summary}</p>
                <div
                  className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--bg)] outline outline-1 outline-[var(--line)]"
                  role="progressbar"
                  aria-valuenow={tp.done}
                  aria-valuemin={0}
                  aria-valuemax={tp.total}
                  aria-label={`${trail.title} progress`}
                >
                  <div
                    className="h-full rounded-full bg-[var(--primary)] transition-[width]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {trail.itemSlugs.map((slug) => {
                    const done = progress.visitedTreasures.includes(slug);
                    return (
                      <Link
                        key={slug}
                        href={`/items/${slug}`}
                        className={`inline-flex min-h-9 items-center rounded-full px-3 text-xs font-medium ${
                          done
                            ? "bg-[var(--saffron-tint)] text-[var(--saffron-ink)]"
                            : "bg-[var(--bg)] text-[var(--ink)] outline outline-1 outline-[var(--line)]"
                        }`}
                      >
                        {treasureTitles[slug] ?? slug}
                      </Link>
                    );
                  })}
                </div>
                <Link
                  href={trail.placeHref}
                  className="mt-4 text-sm font-medium text-[var(--primary)] underline-offset-4 hover:underline"
                >
                  {tp.complete ? "Trail complete · revisit place" : "Continue trail"}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {progress.visitedTreasures.length > 0 ? (
        <section aria-labelledby="visited-heading">
          <h2 id="visited-heading" className="serif text-2xl">
            Visited treasures
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {progress.visitedTreasures.map((slug) => (
              <li key={slug}>
                <Link
                  href={`/items/${slug}`}
                  className="inline-flex min-h-10 items-center rounded-full bg-[var(--surface)] px-4 text-sm outline outline-1 outline-[var(--line)]"
                >
                  {treasureTitles[slug] ?? slug}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Quiz stamps on this device: {progress.quizStamps.length}
          </p>
        </section>
      ) : null}
    </div>
  );
}
