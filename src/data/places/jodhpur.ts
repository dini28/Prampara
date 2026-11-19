import type { DestinationBundle } from "@/lib/place-types";

export const jodhpurBundle: DestinationBundle = {
  destination: {
    id: "dest-jodhpur",
    slug: "jodhpur",
    kind: "city",
    name: "Jodhpur",
    parent_slug: "rajasthan",
    state_ut: "Rajasthan",
    lat: 26.2389,
    lng: 73.0243,
    summary:
      "Jodhpur sits under Mehrangarh with blue-washed lanes and craft markets. Place layers will expand from this data file without route code changes.",
    hero_image: {
      src: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=80",
      alt: "Blue houses and fort hill in Jodhpur",
      credit: "Photo via Unsplash",
    },
    related_card_slugs: ["kalbelia"],
  },
  places: [],
  experiences: [],
  modern_items: [],
  meanings: [],
  itineraries: [],
};
