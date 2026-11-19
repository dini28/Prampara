/** Lightweight destination list for client search (no full place payloads). */
export type DestinationLite = {
  slug: string;
  name: string;
  kind: "state" | "city";
  state_ut: string;
  parent_slug: string | null;
};

const DESTINATIONS: DestinationLite[] = [
  { slug: "rajasthan", name: "Rajasthan", kind: "state", state_ut: "Rajasthan", parent_slug: null },
  { slug: "udaipur", name: "Udaipur", kind: "city", state_ut: "Rajasthan", parent_slug: "rajasthan" },
  { slug: "jaipur", name: "Jaipur", kind: "city", state_ut: "Rajasthan", parent_slug: "rajasthan" },
  { slug: "jodhpur", name: "Jodhpur", kind: "city", state_ut: "Rajasthan", parent_slug: "rajasthan" },
  {
    slug: "jaisalmer",
    name: "Jaisalmer",
    kind: "city",
    state_ut: "Rajasthan",
    parent_slug: "rajasthan",
  },
];

export function getDestinations(): DestinationLite[] {
  return DESTINATIONS;
}
