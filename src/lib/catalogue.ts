import catalogueJson from "@/data/catalogue.json";
import type { Catalogue, HeritageItem, HeritageType, Region } from "@/lib/types";

const catalogue = catalogueJson as Catalogue;

export function getDisclaimer() {
  return catalogue.disclaimer;
}

export function getRegions(): Region[] {
  return catalogue.regions;
}

export function getRegionBySlug(slug: string): Region | undefined {
  return catalogue.regions.find((r) => r.slug === slug);
}

export function getRegionById(id: string): Region | undefined {
  return catalogue.regions.find((r) => r.id === id);
}

export function getItems(): HeritageItem[] {
  return catalogue.items.filter((i) => i.published);
}

export function getItemBySlug(slug: string): HeritageItem | undefined {
  return getItems().find((i) => i.slug === slug);
}

/** Place phrases that should match several region slugs (homepage / casual search). */
const PLACE_ALIASES: Record<string, string[]> = {
  northeast: ["assam", "manipur"],
  "north-east": ["assam", "manipur"],
  "north east": ["assam", "manipur"],
  himalaya: ["ladakh", "jammu-kashmir", "himachal-pradesh", "uttarakhand"],
  himalayan: ["ladakh", "jammu-kashmir", "himachal-pradesh", "uttarakhand"],
  deccan: ["karnataka", "telangana", "andhra-pradesh", "maharashtra"],
  hampi: ["karnataka"],
  bengal: ["west-bengal"],
  "west bengal": ["west-bengal"],
};

export function filterItems(opts: {
  q?: string;
  type?: HeritageType | "all";
  region?: string;
  unesco?: boolean;
  gi?: boolean;
}): HeritageItem[] {
  const q = (opts.q ?? "").trim().toLowerCase();
  const aliasRegions = q ? PLACE_ALIASES[q] : undefined;

  return getItems().filter((item) => {
    if (opts.type && opts.type !== "all" && item.type !== opts.type) return false;
    if (opts.region && item.region_slug !== opts.region) return false;
    if (opts.unesco && !item.unesco_id) return false;
    if (opts.gi && !item.gi_flag) return false;
    if (!q) return true;

    if (aliasRegions?.includes(item.region_slug)) return true;

    const region = getRegionBySlug(item.region_slug);
    const hay = [
      item.title,
      item.summary,
      item.body,
      item.tags.join(" "),
      item.languages.join(" "),
      item.region_slug,
      region?.name,
      region?.state_ut,
      region?.zone,
      region?.blurb,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

export function countByType(): Record<HeritageType, number> {
  const counts = {
    festival: 0,
    craft: 0,
    performing: 0,
    oral: 0,
    ritual: 0,
    knowledge: 0,
  } satisfies Record<HeritageType, number>;
  for (const item of getItems()) counts[item.type] += 1;
  return counts;
}

export const TYPE_LABEL: Record<HeritageType, string> = {
  festival: "Festival",
  craft: "Craft",
  performing: "Performing",
  oral: "Oral",
  ritual: "Ritual",
  knowledge: "Knowledge",
};
