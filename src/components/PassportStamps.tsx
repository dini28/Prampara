"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { computeBadges, type PassportBadge } from "@/lib/badges";
import { getStateBySlug } from "@/lib/india-states";
import { readProgress, type LearnerProgress } from "@/lib/learner-progress";

type StampSlot = {
  id: string;
  kind: "state" | "badge" | "quiz" | "empty";
  title: string;
  subtitle: string;
  earned: boolean;
  href?: string;
  ink: "saffron" | "indigo" | "terracotta" | "muted";
  rotate: number;
};

const EMPTY_TEASERS: Omit<StampSlot, "earned">[] = [
  {
    id: "empty-map",
    kind: "empty",
    title: "State seal",
    subtitle: "Stamp a place on the India map",
    href: "/map",
    ink: "muted",
    rotate: -4,
  },
  {
    id: "empty-quiz",
    kind: "empty",
    title: "Quiz seal",
    subtitle: "Finish a card quiz to ink this",
    href: "/items/kalbelia/quiz",
    ink: "muted",
    rotate: 3,
  },
  {
    id: "empty-treasure",
    kind: "empty",
    title: "Treasure seal",
    subtitle: "Open a cited heritage card",
    href: "/map",
    ink: "muted",
    rotate: -2,
  },
  {
    id: "empty-trail",
    kind: "empty",
    title: "Trail seal",
    subtitle: "Walk a themed trail in Passport",
    href: "/passport",
    ink: "muted",
    rotate: 5,
  },
];

function badgeInk(id: string): StampSlot["ink"] {
  if (id.includes("quiz") || id.includes("three-quizzes")) return "terracotta";
  if (id.includes("state") || id.includes("map")) return "indigo";
  return "saffron";
}

function buildSlots(progress: LearnerProgress, badges: PassportBadge[]): StampSlot[] {
  const slots: StampSlot[] = [];

  for (const [i, slug] of progress.unlockedStates.slice(0, 8).entries()) {
    const state = getStateBySlug(slug);
    slots.push({
      id: `state-${slug}`,
      kind: "state",
      title: state?.name ?? slug,
      subtitle: "Place unlocked",
      earned: true,
      href: `/places/${slug}`,
      ink: i % 2 === 0 ? "saffron" : "indigo",
      rotate: ((i % 5) - 2) * 2.5,
    });
  }

  for (const [i, stamp] of progress.quizStamps.slice(0, 6).entries()) {
    slots.push({
      id: `quiz-${stamp}`,
      kind: "quiz",
      title: "Quiz ink",
      subtitle: stamp.replace(/-/g, " "),
      earned: true,
      href: `/items/${stamp}`,
      ink: "terracotta",
      rotate: ((i % 4) - 1.5) * 2,
    });
  }

  for (const [i, badge] of badges.filter((b) => b.earned).slice(0, 6).entries()) {
    slots.push({
      id: `badge-${badge.id}`,
      kind: "badge",
      title: badge.title,
      subtitle: badge.description,
      earned: true,
      href: "/passport",
      ink: badgeInk(badge.id),
      rotate: ((i % 5) - 2) * 2.2,
    });
  }

  if (slots.length === 0) {
    return EMPTY_TEASERS.map((t) => ({ ...t, earned: false }));
  }

  const emptiesNeeded = Math.max(0, 8 - slots.length);
  for (let i = 0; i < emptiesNeeded; i++) {
    const teaser = EMPTY_TEASERS[i % EMPTY_TEASERS.length];
    slots.push({ ...teaser, id: `${teaser.id}-${i}`, earned: false });
  }

  return slots.slice(0, 12);
}

function StampFace({ slot }: { slot: StampSlot }) {
  const inkClass =
    slot.ink === "saffron"
      ? "text-[var(--saffron-ink)] border-[var(--saffron)]"
      : slot.ink === "indigo"
        ? "text-[var(--primary-deep)] border-[var(--primary)]"
        : slot.ink === "terracotta"
          ? "text-[var(--terracotta)] border-[var(--terracotta)]"
          : "text-[var(--muted)] border-[var(--line-strong)]";

  const fillClass = slot.earned
    ? slot.ink === "saffron"
      ? "bg-[var(--saffron-tint)]/80"
      : slot.ink === "indigo"
        ? "bg-[var(--primary-tint)]/80"
        : slot.ink === "terracotta"
          ? "bg-[var(--terracotta-tint)]/80"
          : "bg-[var(--surface)]"
    : "bg-[var(--bg)]";

  const inner = (
    <div
      className={`passport-stamp ${fillClass} ${inkClass} ${slot.earned ? "passport-stamp--inked" : "passport-stamp--empty"}`}
      style={{ transform: `rotate(${slot.rotate}deg)` }}
    >
      <span className="passport-stamp__ring" aria-hidden="true" />
      <span className="relative z-[1] flex flex-col items-center px-2 text-center">
        <span className="text-[9px] font-bold tracking-[0.18em] uppercase opacity-80">
          {slot.kind === "empty" ? "Awaiting" : "Parampara"}
        </span>
        <span className="serif mt-1 text-[15px] leading-tight font-semibold">{slot.title}</span>
        <span className="mt-1 line-clamp-2 text-[10px] leading-snug opacity-80">{slot.subtitle}</span>
      </span>
    </div>
  );

  if (slot.href) {
    return (
      <Link
        href={slot.href}
        className="group flex justify-center focus-visible:outline-none"
        aria-label={`${slot.title}. ${slot.subtitle}`}
      >
        {inner}
      </Link>
    );
  }

  return <div className="flex justify-center">{inner}</div>;
}

type Props = {
  /** Compact teaser for the landing page */
  teaser?: boolean;
};

export function PassportStamps({ teaser = false }: Props) {
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

  const slots = useMemo(() => {
    if (!progress) return EMPTY_TEASERS.map((t) => ({ ...t, earned: false }));
    const all = buildSlots(progress, badges);
    return teaser ? all.slice(0, 8) : all;
  }, [progress, badges, teaser]);

  const inked = slots.filter((s) => s.earned).length;

  return (
    <section aria-labelledby={teaser ? "home-stamps" : "passport-stamps-grid"}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id={teaser ? "home-stamps" : "passport-stamps-grid"}
            className="serif text-2xl sm:text-3xl"
          >
            {teaser ? "Your passport page" : "Stamp page"}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[var(--ink-soft)] sm:text-base">
            {teaser
              ? "Collect ink seals as you unlock states, finish quizzes, and walk trails. Empty rings wait for your next visit."
              : "Each seal is earned on this device. Rotate, collect, and fill the page like a traveller's passport."}
          </p>
        </div>
        <p className="text-sm tabular-nums text-[var(--muted)]">
          {inked} inked
          {teaser ? (
            <>
              {" · "}
              <Link href="/passport" className="font-medium text-[var(--primary)] underline-offset-4 hover:underline">
                Open passport
              </Link>
            </>
          ) : null}
        </p>
      </div>

      <div className="passport-stamp-sheet mt-6">
        <div className="passport-stamp-grid">
          {slots.map((slot) => (
            <StampFace key={slot.id} slot={slot} />
          ))}
        </div>
      </div>

      {teaser ? (
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/map"
            className="btn inline-flex min-h-12 items-center rounded-full bg-[var(--primary)] px-5 text-sm font-semibold text-[var(--on-primary)] hover:bg-[var(--primary-hover)]"
          >
            Earn your first stamp
          </Link>
          <Link
            href="/passport"
            className="btn inline-flex min-h-12 items-center rounded-full border border-[var(--line-strong)] px-5 text-sm font-medium hover:border-[var(--primary)]"
          >
            View full passport
          </Link>
        </div>
      ) : null}
    </section>
  );
}
