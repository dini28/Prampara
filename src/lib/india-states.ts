import { getItems, getRegions } from "@/lib/catalogue";

/** All 28 states + 8 UTs. svgId matches public/india-states.svg path ids. */
export type IndiaState = {
  svgId: string;
  slug: string;
  name: string;
};

export const INDIA_STATES: IndiaState[] = [
  { svgId: "INAN", slug: "andaman-and-nicobar", name: "Andaman and Nicobar Islands" },
  { svgId: "INAP", slug: "andhra-pradesh", name: "Andhra Pradesh" },
  { svgId: "INAR", slug: "arunachal-pradesh", name: "Arunachal Pradesh" },
  { svgId: "INAS", slug: "assam", name: "Assam" },
  { svgId: "INBR", slug: "bihar", name: "Bihar" },
  { svgId: "INCH", slug: "chandigarh", name: "Chandigarh" },
  { svgId: "INCT", slug: "chhattisgarh", name: "Chhattisgarh" },
  { svgId: "INDH", slug: "dadra-daman-diu", name: "Dadra and Nagar Haveli and Daman and Diu" },
  { svgId: "INDL", slug: "delhi", name: "Delhi" },
  { svgId: "INGA", slug: "goa", name: "Goa" },
  { svgId: "INGJ", slug: "gujarat", name: "Gujarat" },
  { svgId: "INHR", slug: "haryana", name: "Haryana" },
  { svgId: "INHP", slug: "himachal-pradesh", name: "Himachal Pradesh" },
  { svgId: "INJH", slug: "jharkhand", name: "Jharkhand" },
  { svgId: "INJK", slug: "jammu-kashmir", name: "Jammu and Kashmir" },
  { svgId: "INKA", slug: "karnataka", name: "Karnataka" },
  { svgId: "INKL", slug: "kerala", name: "Kerala" },
  { svgId: "INLA", slug: "ladakh", name: "Ladakh" },
  { svgId: "INLD", slug: "lakshadweep", name: "Lakshadweep" },
  { svgId: "INMH", slug: "maharashtra", name: "Maharashtra" },
  { svgId: "INML", slug: "meghalaya", name: "Meghalaya" },
  { svgId: "INMN", slug: "manipur", name: "Manipur" },
  { svgId: "INMP", slug: "madhya-pradesh", name: "Madhya Pradesh" },
  { svgId: "INMZ", slug: "mizoram", name: "Mizoram" },
  { svgId: "INNL", slug: "nagaland", name: "Nagaland" },
  { svgId: "INOR", slug: "odisha", name: "Odisha" },
  { svgId: "INPB", slug: "punjab", name: "Punjab" },
  { svgId: "INPY", slug: "puducherry", name: "Puducherry" },
  { svgId: "INRJ", slug: "rajasthan", name: "Rajasthan" },
  { svgId: "INSK", slug: "sikkim", name: "Sikkim" },
  { svgId: "INTG", slug: "telangana", name: "Telangana" },
  { svgId: "INTN", slug: "tamil-nadu", name: "Tamil Nadu" },
  { svgId: "INTR", slug: "tripura", name: "Tripura" },
  { svgId: "INUP", slug: "uttar-pradesh", name: "Uttar Pradesh" },
  { svgId: "INUT", slug: "uttarakhand", name: "Uttarakhand" },
  { svgId: "INWB", slug: "west-bengal", name: "West Bengal" },
];

export const INDIA_STATE_COUNT = INDIA_STATES.length;

export function getStateBySlug(slug: string): IndiaState | undefined {
  return INDIA_STATES.find((s) => s.slug === slug);
}

export function getStateBySvgId(svgId: string): IndiaState | undefined {
  return INDIA_STATES.find((s) => s.svgId === svgId);
}

/** Catalogue region_slug → India state slug (usually 1:1). */
export function regionSlugToStateSlug(regionSlug: string): string | null {
  if (getStateBySlug(regionSlug)) return regionSlug;
  const region = getRegions().find((r) => r.slug === regionSlug);
  if (!region?.state_ut) return null;
  const hit = INDIA_STATES.find((s) => s.name === region.state_ut);
  return hit?.slug ?? null;
}

export function getCatalogueCoverage(): {
  coveredSlugs: Set<string>;
  cardCountByState: Record<string, number>;
  coveredCount: number;
  totalStates: number;
} {
  const cardCountByState: Record<string, number> = {};
  for (const item of getItems()) {
    const stateSlug = regionSlugToStateSlug(item.region_slug);
    if (!stateSlug) continue;
    cardCountByState[stateSlug] = (cardCountByState[stateSlug] ?? 0) + 1;
  }
  const coveredSlugs = new Set(Object.keys(cardCountByState));
  return {
    coveredSlugs,
    cardCountByState,
    coveredCount: coveredSlugs.size,
    totalStates: INDIA_STATE_COUNT,
  };
}
