import type { HeritageItem, Region } from "@/lib/types";

export type PlaceEnrichment = {
  story: string;
  traditions: string;
  bestSeason: string;
  howToReach: string;
  respectfulTips: string;
  lesserKnown: boolean;
  categories: string[];
};

const FAMOUS_SLUGS = new Set([
  "kalbelia",
  "durga-puja-kolkata",
  "kumbh-mela",
  "garba",
  "kathakali",
]);

/** Derive traveller-facing fields from existing cited cards (no invented ritual detail). */
export function enrichPlace(item: HeritageItem, region?: Region | null): PlaceEnrichment {
  const paragraphs = item.body.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  const story = paragraphs[0] ?? item.summary;
  const traditions =
    paragraphs.find((p) => /perform|practice|craft|festival|ritual|song|dance|weav/i.test(p)) ??
    paragraphs[1] ??
    item.summary;
  const tips =
    paragraphs.find((p) => /respect|do not|omit|care|photo|ask/i.test(p)) ??
    "Visit as a guest: ask before photographing people or ceremonies, follow local guidance, and do not invent meanings the sources do not support.";

  const placeHint = region
    ? `${region.name}${region.state_ut ? `, ${region.state_ut}` : ""}`
    : item.region_slug;

  const howToReach = region?.lat != null && region?.lng != null
    ? `Pin near ${placeHint} (approx. ${region.lat.toFixed(2)}°, ${region.lng.toFixed(2)}°). Use public transport and local advice for the last mile; this app does not invent routes or timings.`
    : `Associated with ${placeHint}. Confirm access with local or official sources — this app does not invent routes.`;

  const lesserKnown =
    !FAMOUS_SLUGS.has(item.slug) &&
    !item.unesco_id &&
    (item.tags.includes("village") ||
      item.tags.includes("oral") ||
      item.type === "oral" ||
      item.type === "knowledge" ||
      item.type === "craft");

  const categories = [
    item.type,
    ...item.tags.filter((t) =>
      ["heritage", "festival", "craft", "food", "folk", "temple", "myth", "village"].some((k) =>
        t.includes(k),
      ),
    ),
  ];

  return {
    story,
    traditions,
    bestSeason: item.calendar_note || "Season varies — check the card note and cited sources.",
    howToReach,
    respectfulTips: tips,
    lesserKnown,
    categories: Array.from(new Set(categories)),
  };
}
