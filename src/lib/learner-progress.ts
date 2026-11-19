/** On-device learner progress (passport stamps + state unlocks). */

export const PROGRESS_KEY = "pp_progress_v1";

export type LearnerProgress = {
  unlockedStates: string[];
  visitedTreasures: string[];
  quizStamps: string[];
  lastVisitIso: string | null;
  gentleStreakDays: number;
};

const EMPTY: LearnerProgress = {
  unlockedStates: [],
  visitedTreasures: [],
  quizStamps: [],
  lastVisitIso: null,
  gentleStreakDays: 0,
};

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function readProgress(): LearnerProgress {
  if (typeof window === "undefined") return { ...EMPTY };
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw) as Partial<LearnerProgress>;
    return {
      unlockedStates: Array.isArray(parsed.unlockedStates) ? parsed.unlockedStates : [],
      visitedTreasures: Array.isArray(parsed.visitedTreasures) ? parsed.visitedTreasures : [],
      quizStamps: Array.isArray(parsed.quizStamps) ? parsed.quizStamps : [],
      lastVisitIso: parsed.lastVisitIso ?? null,
      gentleStreakDays: typeof parsed.gentleStreakDays === "number" ? parsed.gentleStreakDays : 0,
    };
  } catch {
    return { ...EMPTY };
  }
}

export function writeProgress(next: LearnerProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("pp-progress"));
}

function bumpStreak(prev: LearnerProgress): LearnerProgress {
  const today = todayIsoDate();
  if (prev.lastVisitIso === today) return prev;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yIso = yesterday.toISOString().slice(0, 10);
  const streak =
    prev.lastVisitIso === yIso ? Math.min(prev.gentleStreakDays + 1, 99) : 1;
  return { ...prev, lastVisitIso: today, gentleStreakDays: streak };
}

export function unlockState(stateSlug: string): LearnerProgress {
  const prev = bumpStreak(readProgress());
  if (prev.unlockedStates.includes(stateSlug)) {
    writeProgress(prev);
    return prev;
  }
  const next = {
    ...prev,
    unlockedStates: [...prev.unlockedStates, stateSlug],
  };
  writeProgress(next);
  return next;
}

export function visitTreasure(itemSlug: string, stateSlug: string | null): LearnerProgress {
  let prev = bumpStreak(readProgress());
  if (!prev.visitedTreasures.includes(itemSlug)) {
    prev = {
      ...prev,
      visitedTreasures: [...prev.visitedTreasures, itemSlug],
    };
  }
  if (stateSlug && !prev.unlockedStates.includes(stateSlug)) {
    prev = {
      ...prev,
      unlockedStates: [...prev.unlockedStates, stateSlug],
    };
  }
  writeProgress(prev);
  return prev;
}

export function addQuizStamp(itemSlug: string): LearnerProgress {
  const prev = bumpStreak(readProgress());
  if (prev.quizStamps.includes(itemSlug)) {
    writeProgress(prev);
    return prev;
  }
  const next = {
    ...prev,
    quizStamps: [...prev.quizStamps, itemSlug],
  };
  writeProgress(next);
  return next;
}
