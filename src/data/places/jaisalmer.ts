import type { DestinationBundle } from "@/lib/place-types";

export const jaisalmerBundle: DestinationBundle = {
  destination: {
    id: "dest-jaisalmer",
    slug: "jaisalmer",
    kind: "city",
    name: "Jaisalmer",
    parent_slug: "rajasthan",
    state_ut: "Rajasthan",
    lat: 26.9157,
    lng: 70.9083,
    summary:
      "Jaisalmer’s living fort and desert edge frame craft and music routes. Heritage stops will be added in data, not hardcoded pages.",
    hero_image: {
      src: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80",
      alt: "Sandstone fort architecture in Rajasthan desert",
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
