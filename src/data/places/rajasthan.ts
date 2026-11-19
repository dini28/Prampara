import type { DestinationBundle, LocalPartner } from "@/lib/place-types";

const src = (
  id: string,
  title: string,
  url: string,
  publisher: string,
  accessed_on = "2026-11-19",
) => ({ id, title, url, publisher, accessed_on });

/** Pilot: Rajasthan state story + linked living-heritage cards. */
export const rajasthanBundle: DestinationBundle = {
  destination: {
    id: "dest-rajasthan",
    slug: "rajasthan",
    kind: "state",
    name: "Rajasthan",
    parent_slug: null,
    state_ut: "Rajasthan",
    lat: 26.9,
    lng: 75.8,
    summary:
      "Rajasthan holds desert routes, court cities, craft lineages, and living performance traditions. This state story connects communities, festivals, food, and architecture so a city visit sits inside a wider cultural map.",
    story_sections: [
      {
        id: "history",
        title: "History and routes",
        body: "Caravan routes, Rajput courts, and later princely states shaped fortified towns and palace cities. Public heritage lists document these layers; this guide does not invent dynastic dates beyond cited sources.",
        related_card_slugs: ["kalbelia"],
      },
      {
        id: "communities",
        title: "Communities",
        body: "Many communities keep distinct crafts, songs, and pastoral knowledge. Named practices on our cards (for example Kalbelia song and dance) point to living people, not costume souvenirs.",
        related_card_slugs: ["kalbelia"],
      },
      {
        id: "crafts",
        title: "Crafts",
        body: "Blue pottery, block printing, leatherwork, and metal crafts appear across cities. Geographical Indication (protected craft name) marks exist for several Rajasthan crafts; check each card for the specific listing.",
        related_card_slugs: ["jaipur-blue-pottery"],
      },
      {
        id: "music",
        title: "Music and performance",
        body: "Folk and court-linked performance traditions remain active in fairs, community gatherings, and staged shows. Stage tourism is paid work; it is not automatically the same as community ceremony.",
        related_card_slugs: ["kalbelia"],
      },
      {
        id: "festivals",
        title: "Festivals",
        body: "Seasonal fairs and city festivals bring crafts, music, and food into public space. Dates shift; confirm with official tourism or municipal notices rather than memorised calendars here.",
      },
      {
        id: "food",
        title: "Food",
        body: "Dal baati churma, gatte ki sabzi, ker sangri, and sweet shops sit beside regional breads. Dishes carry community and seasonal stories; recipes and restaurant claims on this site stay tied to cited notes only.",
      },
      {
        id: "architecture",
        title: "Architecture",
        body: "Forts, havelis, stepwells, and lake palaces show stone craft, jali screens, and courtyard living. Notice patterns and water systems on site; meanings for motifs come from cited place notes, not invented myths.",
      },
      {
        id: "connections",
        title: "How they connect",
        body: "Craft streets feed palace ornament; performance travels with pastoral and urban networks; food follows water and monsoon calendars. City pages (Udaipur, Jaipur, Jodhpur, Jaisalmer) zoom into routes you can walk.",
      },
    ],
    hero_image: {
      src: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1600&q=80",
      alt: "Amber Fort terraces and walls near Jaipur, Rajasthan",
      credit: "Photo via Unsplash (Amber Fort area)",
    },
    related_card_slugs: ["kalbelia", "jaipur-blue-pottery"],
  },
  places: [],
  experiences: [],
  modern_items: [],
  meanings: [],
  itineraries: [],
};

export const rajasthanPartners: LocalPartner[] = [
  {
    id: "lp-rj-1",
    destination_slug: "rajasthan",
    kind: "artisan",
    name: "Craft cooperatives and GI workshops (city listed)",
    tip: "Buy direct from workshop counters when open; ask before photographing makers; pay the marked price without aggressive bargaining on handmade work.",
    sources: [
      src(
        "s-rj-gi",
        "Geographical Indications Registry (India)",
        "https://ipindia.gov.in/gi.htm",
        "Office of the Controller General of Patents, Designs and Trade Marks",
      ),
    ],
    last_verified: "2026-11-19",
  },
];
