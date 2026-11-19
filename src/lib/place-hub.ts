import { getItems, getRegionBySlug, getRegions } from "@/lib/catalogue";
import {
  getChildCities,
  getDestinationBySlug,
  getDestinations,
} from "@/lib/destinations";
import {
  getStateBySlug,
  INDIA_STATES,
  regionSlugToStateSlug,
  type IndiaState,
} from "@/lib/india-states";
import type { HeritageItem, Region } from "@/lib/types";
import type { Destination } from "@/lib/place-types";

export type PlaceHubKind = "state" | "city";

export type PlaceHub = {
  slug: string;
  kind: PlaceHubKind;
  name: string;
  stateSlug: string;
  stateName: string;
  blurb: string;
  region: Region | null;
  destination: Destination | null;
  parent: Destination | null;
  childCities: Destination[];
  treasures: HeritageItem[];
  etiquette: string;
};

const DEFAULT_ETIQUETTE =
  "Visit as a guest. Ask before photographing people or ceremonies. Do not treat sacred or restricted places as collectible targets. Follow local guidance. This app teaches with citations , it does not encourage trespass.";

export function getAllPlaceHubSlugs(): string[] {
  const slugs = new Set<string>();
  for (const s of INDIA_STATES) slugs.add(s.slug);
  for (const r of getRegions()) slugs.add(r.slug);
  for (const d of getDestinations()) slugs.add(d.slug);
  return [...slugs];
}

export function getTreasuresForState(stateSlug: string): HeritageItem[] {
  return getItems().filter((item) => regionSlugToStateSlug(item.region_slug) === stateSlug);
}

function etiquetteFor(treasures: HeritageItem[]): string {
  if (treasures.some((t) => t.sensitivity_flag)) {
    return `${DEFAULT_ETIQUETTE} Some treasures here are marked handle with care: no precise pins for sensitive practices.`;
  }
  return DEFAULT_ETIQUETTE;
}

export function resolvePlaceHub(slug: string): PlaceHub | null {
  const destination = getDestinationBySlug(slug);
  if (destination) {
    const stateSlug =
      destination.kind === "state"
        ? destination.slug
        : (destination.parent_slug ?? "rajasthan");
    const stateMeta: IndiaState | undefined = getStateBySlug(stateSlug);
    const parent = destination.parent_slug
      ? getDestinationBySlug(destination.parent_slug) ?? null
      : null;
    const treasures = getTreasuresForState(stateSlug);
    const region = getRegionBySlug(stateSlug) ?? null;
    return {
      slug: destination.slug,
      kind: destination.kind === "state" ? "state" : "city",
      name: destination.name,
      stateSlug,
      stateName: stateMeta?.name ?? destination.state_ut,
      blurb: destination.summary,
      region,
      destination,
      parent,
      childCities: destination.kind === "state" ? getChildCities(destination.slug) : [],
      treasures,
      etiquette: etiquetteFor(treasures),
    };
  }

  const state = getStateBySlug(slug);
  if (!state) return null;

  const region = getRegionBySlug(slug) ?? null;
  const treasures = getTreasuresForState(slug);
  const destState = getDestinationBySlug(slug) ?? null;

  return {
    slug: state.slug,
    kind: "state",
    name: state.name,
    stateSlug: state.slug,
    stateName: state.name,
    blurb: region?.blurb ?? `${state.name}: living heritage cards appear here as they are published with sources. Empty means not invented yet.`,
    region,
    destination: destState,
    parent: null,
    childCities: getChildCities(state.slug),
    treasures,
    etiquette: etiquetteFor(treasures),
  };
}
