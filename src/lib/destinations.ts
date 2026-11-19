import { jaisalmerBundle } from "@/data/places/jaisalmer";
import { jaipurBundle } from "@/data/places/jaipur";
import { jodhpurBundle } from "@/data/places/jodhpur";
import { rajasthanBundle, rajasthanPartners } from "@/data/places/rajasthan";
import { udaipurBundle, udaipurPartners } from "@/data/places/udaipur";
import type {
  Destination,
  DestinationBundle,
  Experience,
  Itinerary,
  LocalPartner,
  Meaning,
  ModernItem,
  Place,
} from "@/lib/place-types";

/** Register new cities here only: data files drive the UI. */
const BUNDLES: DestinationBundle[] = [
  rajasthanBundle,
  udaipurBundle,
  jaipurBundle,
  jodhpurBundle,
  jaisalmerBundle,
];

const PARTNERS: LocalPartner[] = [...rajasthanPartners, ...udaipurPartners];

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function getAllBundles(): DestinationBundle[] {
  return BUNDLES;
}

export function getDestinations(): Destination[] {
  return BUNDLES.map((b) => b.destination);
}

export function getDestinationBySlug(slug: string): Destination | undefined {
  return getDestinations().find((d) => d.slug === slug);
}

export function getBundle(slug: string): DestinationBundle | undefined {
  return BUNDLES.find((b) => b.destination.slug === slug);
}

export function getChildCities(stateSlug: string): Destination[] {
  return getDestinations().filter((d) => d.kind === "city" && d.parent_slug === stateSlug);
}

export function getPlaces(destinationSlug?: string): Place[] {
  const places = BUNDLES.flatMap((b) => b.places);
  return destinationSlug ? places.filter((p) => p.destination_slug === destinationSlug) : places;
}

export function getPlaceBySlug(slug: string): Place | undefined {
  return getPlaces().find((p) => p.slug === slug);
}

export function getExperiences(destinationSlug?: string, type?: Experience["type"]): Experience[] {
  let list = BUNDLES.flatMap((b) => b.experiences);
  if (destinationSlug) list = list.filter((e) => e.destination_slug === destinationSlug);
  if (type) list = list.filter((e) => e.type === type);
  return list;
}

export function getModernItems(destinationSlug?: string): ModernItem[] {
  const list = BUNDLES.flatMap((b) => b.modern_items);
  return destinationSlug ? list.filter((m) => m.destination_slug === destinationSlug) : list;
}

export function getMeanings(destinationSlug?: string): Meaning[] {
  const list = BUNDLES.flatMap((b) => b.meanings);
  if (!destinationSlug) return list;
  return list.filter((m) => m.destination_slugs.includes(destinationSlug));
}

export function getMeaningBySlug(slug: string): Meaning | undefined {
  return getMeanings().find((m) => m.slug === slug);
}

export function getItineraries(destinationSlug?: string): Itinerary[] {
  const list = BUNDLES.flatMap((b) => b.itineraries);
  return destinationSlug ? list.filter((i) => i.destination_slug === destinationSlug) : list;
}

export function getPartners(destinationSlug?: string): LocalPartner[] {
  return destinationSlug
    ? PARTNERS.filter((p) => p.destination_slug === destinationSlug)
    : PARTNERS;
}

export function findNearestDestination(lat: number, lng: number): {
  destination: Destination;
  distanceKm: number;
} | null {
  const cities = getDestinations().filter((d) => d.kind === "city");
  if (!cities.length) return null;
  let best: { destination: Destination; distanceKm: number } | null = null;
  for (const destination of cities) {
    const distanceKm = haversineKm({ lat, lng }, { lat: destination.lat, lng: destination.lng });
    if (!best || distanceKm < best.distanceKm) best = { destination, distanceKm };
  }
  return best;
}

/** Match photo hints / user text to Meaning entries without inventing content. */
export function matchMeanings(opts: {
  hint?: string;
  destinationSlug?: string;
  limit?: number;
}): { meaning: Meaning; score: number; confidence: "High" | "Medium" | "Low" }[] {
  const hint = (opts.hint ?? "").trim().toLowerCase();
  const pool = getMeanings(opts.destinationSlug);
  if (!hint) {
    return pool.slice(0, opts.limit ?? 5).map((meaning) => ({
      meaning,
      score: 0,
      confidence: "Low" as const,
    }));
  }

  const scored = pool
    .map((meaning) => {
      const hay = [
        meaning.name,
        meaning.object_type,
        ...meaning.visual_hints,
        meaning.symbolises,
      ]
        .join(" ")
        .toLowerCase();
      let score = 0;
      for (const token of hint.split(/\s+/).filter((t) => t.length > 2)) {
        if (hay.includes(token)) score += 2;
        if (meaning.visual_hints.some((h) => h.toLowerCase() === token)) score += 3;
        if (meaning.name.toLowerCase().includes(token)) score += 4;
      }
      for (const h of meaning.visual_hints) {
        if (hint.includes(h.toLowerCase())) score += 5;
      }
      const confidence: "High" | "Medium" | "Low" =
        score >= 10 ? "High" : score >= 5 ? "Medium" : "Low";
      return { meaning, score, confidence };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, opts.limit ?? 5);
}

export const PLACE_CATEGORY_LABEL: Record<Place["category"], string> = {
  heritage_site: "Heritage site",
  living_tradition: "Living tradition",
  craft_street: "Craft street",
  market: "Market",
  nature: "Nature and landscape",
  modern_space: "Modern space",
  temple: "Temple",
  palace: "Palace",
};

export const MODERN_THEME_LABEL: Record<ModernItem["theme"], string> = {
  design: "Design",
  startup: "Startups and co-working",
  art: "Art",
  music: "Music and festivals",
  sustainability: "Sustainability and craft revival",
  infrastructure: "Infrastructure",
  cafe: "Cafes and food entrepreneurs",
};
