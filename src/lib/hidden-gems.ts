import { getItemBySlug, getItems } from "@/lib/catalogue";
import { regionSlugToStateSlug } from "@/lib/india-states";
import { getStateIdentity } from "@/lib/state-identity";
import type { HeritageItem } from "@/lib/types";

export type HiddenGem = {
  slug: string;
  title: string;
  type: HeritageItem["type"];
  summary: string;
  stateSlug: string;
  stateName: string;
  greeting: string;
  identityFact: string;
  whyHidden: string;
  unesco: boolean;
  gi: boolean;
};

/**
 * Curated living-heritage gems that show India's true cultural identity
 * beyond monument tourism. Prefer cited crafts, rituals, and performance
 * that travellers often miss on city itineraries.
 */
const GEM_SLUGS = [
  "thathera-jandiala-guru",
  "theyyam",
  "madhubani-painting",
  "sankirtana",
  "ajrakh",
  "chhau-dance",
  "apatani-textile-arunachal",
  "sohrai-khovar-jharkhand",
  "muga-silk",
  "dhokra",
  "lyrnai-pottery-meghalaya",
  "chakhesang-shawl-nagaland",
] as const;

const WHY_HIDDEN: Record<string, string> = {
  "thathera-jandiala-guru": "Living metal craft at Jandiala Guru, not a fort checklist stop.",
  theyyam: "Temple-linked ritual performance of northern Kerala, beyond beach itineraries.",
  "madhubani-painting": "Village painting lineages that outlast monument-only Bihar trips.",
  sankirtana: "Manipur's court-to-temple performance, rarely on mainland tourist maps.",
  ajrakh: "Block-printed cloth knowledge of Kutch, not only city craft bazaars.",
  "chhau-dance": "Masked dance across Odisha belts that city guides often skip.",
  "apatani-textile-arunachal": "Arunachal weave identity, not a souvenir stereotype.",
  "sohrai-khovar-jharkhand": "Jharkhand mural traditions tied to harvest and home walls.",
  "muga-silk": "Assam's golden silk practice beyond tea-estate tourism.",
  dhokra: "Bell-metal casting communities central to the plateau, not an afterthought.",
  "lyrnai-pottery-meghalaya": "Meghalaya potter knowledge that rarely makes city brochures.",
  "chakhesang-shawl-nagaland": "Nagaland textile identity carried by makers, not costume props.",
};

function resolveSlug(preferred: string): HeritageItem | undefined {
  const direct = getItemBySlug(preferred);
  if (direct) return direct;
  // Fallback: first published item whose slug contains the stem
  const stem = preferred.split("-")[0] ?? preferred;
  return getItems().find((i) => i.slug.includes(stem));
}

export function getHiddenGems(limit = 12): HiddenGem[] {
  const gems: HiddenGem[] = [];
  const seenStates = new Set<string>();

  for (const preferred of GEM_SLUGS) {
    const item = resolveSlug(preferred);
    if (!item) continue;
    const stateSlug = regionSlugToStateSlug(item.region_slug) ?? item.region_slug;
    if (seenStates.has(stateSlug)) continue;
    seenStates.add(stateSlug);
    const identity = getStateIdentity(stateSlug);
    gems.push({
      slug: item.slug,
      title: item.title,
      type: item.type,
      summary: item.summary,
      stateSlug,
      stateName: identity.name,
      greeting: identity.greeting,
      identityFact: identity.fact,
      whyHidden: WHY_HIDDEN[preferred] ?? identity.fact,
      unesco: Boolean(item.unesco_id),
      gi: item.gi_flag,
    });
    if (gems.length >= limit) break;
  }

  if (gems.length < limit) {
    for (const item of getItems()) {
      const stateSlug = regionSlugToStateSlug(item.region_slug) ?? item.region_slug;
      if (seenStates.has(stateSlug)) continue;
      if (item.type === "knowledge" && item.title.toLowerCase().includes("capitol")) continue;
      seenStates.add(stateSlug);
      const identity = getStateIdentity(stateSlug);
      gems.push({
        slug: item.slug,
        title: item.title,
        type: item.type,
        summary: item.summary,
        stateSlug,
        stateName: identity.name,
        greeting: identity.greeting,
        identityFact: identity.fact,
        whyHidden: identity.fact,
        unesco: Boolean(item.unesco_id),
        gi: item.gi_flag,
      });
      if (gems.length >= limit) break;
    }
  }

  return gems;
}
