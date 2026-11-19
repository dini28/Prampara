import type { DestinationBundle } from "@/lib/place-types";

/** Stub city bundle: structure ready; expand places without code changes. */
export const jaipurBundle: DestinationBundle = {
  destination: {
    id: "dest-jaipur",
    slug: "jaipur",
    kind: "city",
    name: "Jaipur",
    parent_slug: "rajasthan",
    state_ut: "Rajasthan",
    lat: 26.9124,
    lng: 75.7873,
    summary:
      "Jaipur links planned pink-city avenues with craft quarters and court forts. Open cited cards for blue pottery and Kalbelia while this city route grows.",
    hero_image: {
      src: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1600&q=80",
      alt: "Fort walls near Jaipur, Rajasthan",
      credit: "Photo via Unsplash",
    },
    related_card_slugs: ["jaipur-blue-pottery", "kalbelia"],
  },
  places: [],
  experiences: [],
  modern_items: [],
  meanings: [],
  itineraries: [],
};
