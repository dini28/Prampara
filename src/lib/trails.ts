/**
 * Data-driven themed trails. Only uses published catalogue slugs.
 * Completing a trail = visit every treasure on it (quiz optional).
 */

export type HeritageTrail = {
  id: string;
  title: string;
  summary: string;
  placeHref: string;
  itemSlugs: string[];
  badgeLabel: string;
};

export const HERITAGE_TRAILS: HeritageTrail[] = [
  {
    id: "rajasthan-desert-crafts",
    title: "Rajasthan desert crafts",
    summary: "Folk performance and ceramic craft from Rajasthan's living traditions.",
    placeHref: "/places/rajasthan",
    itemSlugs: ["kalbelia", "jaipur-blue-pottery"],
    badgeLabel: "Desert crafts",
  },
  {
    id: "kerala-ritual-arts",
    title: "Kerala ritual arts",
    summary: "Theatre and ritual performance paths with cited UNESCO and regional sources.",
    placeHref: "/places/kerala",
    itemSlugs: ["kutiyattam", "mudiyettu", "theyyam"],
    badgeLabel: "Kerala ritual arts",
  },
  {
    id: "northeast-living-arts",
    title: "North-East living arts",
    summary: "Assam and Manipur practices: silk, festival, and sankirtana.",
    placeHref: "/places/assam",
    itemSlugs: ["muga-silk", "bihu", "sankirtana"],
    badgeLabel: "North-East arts",
  },
  {
    id: "gi-craft-path",
    title: "Protected craft names",
    summary: "A short path across GI-linked crafts published in the catalogue.",
    placeHref: "/map",
    itemSlugs: [
      "thathera-jandiala-guru",
      "banarasi-brocade",
      "channapatna-toys",
      "kanchipuram-silk",
    ],
    badgeLabel: "GI craft path",
  },
];

export function trailProgress(
  trail: HeritageTrail,
  visited: string[],
): { done: number; total: number; complete: boolean; remaining: string[] } {
  const visitedSet = new Set(visited);
  const remaining = trail.itemSlugs.filter((s) => !visitedSet.has(s));
  const done = trail.itemSlugs.length - remaining.length;
  return {
    done,
    total: trail.itemSlugs.length,
    complete: remaining.length === 0,
    remaining,
  };
}
