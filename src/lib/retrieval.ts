import { getItemBySlug, getItems } from "@/lib/catalogue";
import type { HeritageItem, Source } from "@/lib/types";

const STOP = new Set(
  "a an the of to in on for and or is are was were be this that what who whom how why when where which with from by at as it its their they them we you i not no yes can may must should would could if then than into over after before about".split(
    " ",
  ),
);

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP.has(t));
}

function scoreChunk(question: string, chunk: string): number {
  const q = new Set(tokens(question));
  const c = tokens(chunk);
  if (q.size === 0 || c.length === 0) return 0;
  let hit = 0;
  for (const t of c) if (q.has(t)) hit += 1;
  return hit / Math.sqrt(c.length);
}

export type RetrievedChunk = {
  item: HeritageItem;
  chunk: string;
  score: number;
};

export function retrieve(question: string, itemSlug?: string, k = 6): RetrievedChunk[] {
  const pool: HeritageItem[] = itemSlug
    ? ([getItemBySlug(itemSlug)].filter(Boolean) as HeritageItem[])
    : getItems();

  const scored: RetrievedChunk[] = [];
  for (const item of pool) {
    const parts = [
      `${item.title}. ${item.summary}`,
      item.body,
      item.calendar_note,
      item.sources.map((s) => `${s.title} ${s.publisher}`).join(". "),
    ];
    for (const chunk of parts) {
      const s = scoreChunk(question, chunk);
      if (s > 0) scored.push({ item, chunk, score: s });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  const unique: RetrievedChunk[] = [];
  const seen = new Set<string>();
  for (const row of scored) {
    const key = row.item.id + row.chunk.slice(0, 80);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(row);
    if (unique.length >= k) break;
  }
  return unique;
}

export const REFUSE_TEMPLATE =
  "I do not know from the verified cards. Parampara Path only answers from retrieved heritage cards and their cited sources. It will not invent ritual rules, dates, prices, medical advice, or community secrets.";

const MIN_SCORE = 0.35;

export function groundedAnswer(
  question: string,
  itemSlug?: string,
): {
  refused: boolean;
  answer: string;
  sources: Source[];
  retrievedIds: string[];
} {
  const chunks = retrieve(question, itemSlug);
  const best = chunks[0];
  if (!best || best.score < MIN_SCORE) {
    return {
      refused: true,
      answer: REFUSE_TEMPLATE,
      sources: itemSlug ? (getItemBySlug(itemSlug)?.sources ?? []) : [],
      retrievedIds: [],
    };
  }

  const qLower = question.toLowerCase();
  const trap =
    /secret|tantra pack|exact (time|minute|timestamp)|price list|medical|diagnose|how to possess|full (mantra|recitation|script)|gi certificate|lead test|accession number/.test(
      qLower,
    );
  if (trap) {
    return {
      refused: true,
      answer: REFUSE_TEMPLATE,
      sources: best.item.sources,
      retrievedIds: [],
    };
  }

  const top = chunks.filter((c) => c.score >= MIN_SCORE).slice(0, 4);
  const text = top
    .map((c) => c.chunk.replace(/\s+/g, " ").trim().slice(0, 700))
    .join("\n\n");
  const sourcesMap = new Map<string, Source>();
  for (const c of top) {
    for (const s of c.item.sources) sourcesMap.set(s.url, s);
  }

  const answer = `Based only on retrieved cards:\n\n${text}\n\nIf a detail is missing above, treat it as unknown. Sources are listed below.`;

  return {
    refused: false,
    answer,
    sources: [...sourcesMap.values()],
    retrievedIds: [...new Set(top.map((c) => c.item.id))],
  };
}
