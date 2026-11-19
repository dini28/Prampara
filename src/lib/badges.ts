import type { LearnerProgress } from "@/lib/learner-progress";
import { HERITAGE_TRAILS, trailProgress } from "@/lib/trails";

export type PassportBadge = {
  id: string;
  title: string;
  description: string;
  earned: boolean;
  hint: string;
};

/** Soft badges from on-device progress. No shame copy when locked. */
export function computeBadges(progress: LearnerProgress): PassportBadge[] {
  const visits = progress.visitedTreasures.length;
  const quizzes = progress.quizStamps.length;
  const states = progress.unlockedStates.length;
  const streak = progress.gentleStreakDays;

  const badges: PassportBadge[] = [
    {
      id: "first-treasure",
      title: "First treasure",
      description: "Opened a cited heritage card.",
      earned: visits >= 1,
      hint: "Open any treasure from the map or a place hub.",
    },
    {
      id: "quiz-stamp",
      title: "Quiz stamp",
      description: "Finished a card quiz on this device.",
      earned: quizzes >= 1,
      hint: "Complete Ask, then the quiz on a treasure.",
    },
    {
      id: "three-quizzes",
      title: "Path of three",
      description: "Three quiz stamps collected.",
      earned: quizzes >= 3,
      hint: "Try quizzes on three different cards.",
    },
    {
      id: "three-states",
      title: "Three states",
      description: "Unlocked three states or UTs.",
      earned: states >= 3,
      hint: "Stamp places on the India map as you explore.",
    },
    {
      id: "five-states",
      title: "Map walker",
      description: "Five states or UTs on your passport.",
      earned: states >= 5,
      hint: "Keep filling the board, one honest place at a time.",
    },
    {
      id: "gentle-streak-3",
      title: "Gentle streak",
      description: "Visited on three consecutive days.",
      earned: streak >= 3,
      hint: "Come back when you like. Streaks stay soft.",
    },
  ];

  for (const trail of HERITAGE_TRAILS) {
    const tp = trailProgress(trail, progress.visitedTreasures);
    badges.push({
      id: `trail-${trail.id}`,
      title: trail.badgeLabel,
      description: `Finished the ${trail.title} trail.`,
      earned: tp.complete,
      hint: `${tp.done}/${tp.total} treasures on this trail.`,
    });
  }

  return badges;
}

export function dailyDiscoverSlug(progress: LearnerProgress, catalogueSlugs: string[]): string | null {
  const visited = new Set(progress.visitedTreasures);
  const open = catalogueSlugs.filter((s) => !visited.has(s));
  if (open.length === 0) return null;
  const day = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < day.length; i++) hash = (hash + day.charCodeAt(i) * (i + 1)) % open.length;
  return open[hash] ?? open[0] ?? null;
}
