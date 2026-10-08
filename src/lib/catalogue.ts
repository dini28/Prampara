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

export function filterItems(opts: {
  q?: string;
  type?: HeritageType | "all";
  region?: string;
  unesco?: boolean;
  gi?: boolean;
}): HeritageItem[] {
  const q = (opts.q ?? "").trim().toLowerCase();
  return getItems().filter((item) => {
    if (opts.type && opts.type !== "all" && item.type !== opts.type) return false;
    if (opts.region && item.region_slug !== opts.region) return false;
    if (opts.unesco && !item.unesco_id) return false;
    if (opts.gi && !item.gi_flag) return false;
    if (!q) return true;
    const hay = [
      item.title,
      item.summary,
      item.body,
      item.tags.join(" "),
      item.region_slug,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

export const TYPE_LABEL: Record<HeritageType, string> = {
  festival: "Festival",
  craft: "Craft",
  performing: "Performing",
  oral: "Oral",
  ritual: "Ritual",
  knowledge: "Knowledge",
};
