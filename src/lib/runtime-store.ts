import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

const dir = path.join(process.cwd(), "data");
const file = path.join(dir, "runtime-queue.json");

export type RuntimeContribution = {
  id: string;
  itemSlug: string;
  body: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  guestLabel: string;
};

export type AskLog = {
  id: string;
  itemSlug?: string;
  question: string;
  refused: boolean;
  createdAt: string;
};

export type QuizProgress = {
  id: string;
  itemSlug: string;
  quizId: string;
  score: number;
  total: number;
  learner: string;
  completedAt: string;
};

type Store = {
  contributions: RuntimeContribution[];
  asks: AskLog[];
  quizzes: QuizProgress[];
};

function empty(): Store {
  return { contributions: [], asks: [], quizzes: [] };
}

function load(): Store {
  if (!existsSync(file)) return empty();
  const parsed = JSON.parse(readFileSync(file, "utf8")) as Partial<Store>;
  return {
    contributions: parsed.contributions ?? [],
    asks: parsed.asks ?? [],
    quizzes: parsed.quizzes ?? [],
  };
}

function save(store: Store) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(file, JSON.stringify(store, null, 2), "utf8");
}

export function addContribution(row: Omit<RuntimeContribution, "id" | "createdAt" | "status">) {
  const store = load();
  const full: RuntimeContribution = {
    ...row,
    id: crypto.randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  store.contributions.unshift(full);
  save(store);
  return full;
}

export function listContributions() {
  return load().contributions;
}

export function moderateContribution(id: string, status: "accepted" | "rejected") {
  const store = load();
  const row = store.contributions.find((c) => c.id === id);
  if (row) row.status = status;
  save(store);
  return row;
}

export function logAsk(row: Omit<AskLog, "id" | "createdAt">) {
  const store = load();
  const full: AskLog = { ...row, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  store.asks.unshift(full);
  store.asks = store.asks.slice(0, 200);
  save(store);
  return full;
}

export function listAsks() {
  return load().asks;
}

export function saveQuizProgress(row: Omit<QuizProgress, "id" | "completedAt">) {
  const store = load();
  const full: QuizProgress = {
    ...row,
    id: crypto.randomUUID(),
    completedAt: new Date().toISOString(),
  };
  store.quizzes = store.quizzes.filter(
    (q) => !(q.itemSlug === row.itemSlug && q.learner === row.learner),
  );
  store.quizzes.unshift(full);
  save(store);
  return full;
}

export function listQuizzes(learner?: string | null) {
  const rows = load().quizzes;
  if (!learner) return rows;
  return rows.filter((q) => q.learner === learner);
}
