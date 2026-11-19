import type { HeritageItem, Region } from "@/lib/types";

export type PlaceEnrichment = {
  story: string;
  traditions: string;
  bestSeason: string;
  howToReach: string;
  placeName: string;
  mapUrl: string | null;
  lat: number | null;
  lng: number | null;
  respectfulTips: string;
  whoKeepsAlive: string;
  howToEngage: string;
  lesserKnown: boolean;
  categories: string[];
  keyFacts: { label: string; value: string }[];
};

const FAMOUS_SLUGS = new Set([
  "kalbelia",
  "durga-puja-kolkata",
  "kumbh-mela",
  "garba",
  "kathakali",
]);

function placeLabel(region?: Region | null, item?: HeritageItem): string {
  if (!region) return item?.region_slug ?? "India";
  if (region.state_ut && region.state_ut !== region.name) {
    return `${region.name}, ${region.state_ut}`;
  }
  return region.name;
}

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

  const name = placeLabel(region, item);
  const lat = region?.lat ?? null;
  const lng = region?.lng ?? null;

  const howToReach =
    lat != null && lng != null
      ? `${name} (approx. ${lat.toFixed(2)}°, ${lng.toFixed(2)}°). Use public transport and local advice for the last mile. This app does not invent routes or timings.`
      : `Associated with ${name}. Confirm access with local or official sources. This app does not invent routes.`;

  const mapUrl =
    lat != null && lng != null
      ? `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=8/${lat}/${lng}`
      : null;

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

  const whoKeepsAlive =
    paragraphs.find((p) => /communit|perform|maker|artisan|keep|practic/i.test(p)) ??
    "See the card body and sources for the communities and institutions named in official listings.";

  const howToEngage =
    "Read the sources, watch as a guest, ask before photographing people, and prefer community-linked venues when the card names them.";

  const keyFacts = [
    { label: "Type", value: item.type },
    { label: "Region", value: name },
    {
      label: "UNESCO Intangible Cultural Heritage",
      value: item.unesco_id ? `Listed (id ${item.unesco_id})` : "Not listed on this card",
    },
    {
      label: "Geographical Indication (protected craft name)",
      value: item.gi_flag ? "GI related flag on card" : "Not flagged on this card",
    },
    { label: "Sources", value: `${item.sources.length}` },
    { label: "Season note", value: item.calendar_note || "See sources" },
  ];

  return {
    story,
    traditions,
    bestSeason: item.calendar_note || "Season varies. Check the note below and cited sources.",
    howToReach,
    placeName: name,
    mapUrl,
    lat,
    lng,
    respectfulTips: tips,
    whoKeepsAlive,
    howToEngage,
    lesserKnown,
    categories: Array.from(new Set(categories)),
    keyFacts,
  };
}
