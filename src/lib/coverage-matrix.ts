import { getItems } from "@/lib/catalogue";
import { INDIA_STATES, regionSlugToStateSlug } from "@/lib/india-states";
import type { HeritageType } from "@/lib/types";

const TYPES: HeritageType[] = [
  "festival",
  "craft",
  "performing",
  "oral",
  "ritual",
  "knowledge",
];

export type CoverageRow = {
  slug: string;
  name: string;
  total: number;
  types: Record<HeritageType, number>;
};

export function buildCoverageMatrix(): {
  rows: CoverageRow[];
  coveredCount: number;
  totalStates: number;
  publishedCards: number;
  missingSlugs: string[];
} {
  const rows: CoverageRow[] = INDIA_STATES.map((s) => ({
    slug: s.slug,
    name: s.name,
    total: 0,
    types: Object.fromEntries(TYPES.map((t) => [t, 0])) as Record<HeritageType, number>,
  }));
  const bySlug = Object.fromEntries(rows.map((r) => [r.slug, r]));

  const items = getItems();
  for (const item of items) {
    const stateSlug = regionSlugToStateSlug(item.region_slug);
    if (!stateSlug || !bySlug[stateSlug]) continue;
    bySlug[stateSlug].total += 1;
    if (TYPES.includes(item.type)) bySlug[stateSlug].types[item.type] += 1;
  }

  const missingSlugs = rows.filter((r) => r.total === 0).map((r) => r.slug);
  return {
    rows,
    coveredCount: rows.filter((r) => r.total > 0).length,
    totalStates: INDIA_STATES.length,
    publishedCards: items.length,
    missingSlugs,
  };
}

export { TYPES as COVERAGE_TYPES };
