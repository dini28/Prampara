import type { HeritageType } from "@/lib/types";

/** Atmosphere photographs (Unsplash) paired with category intent — captions stay place-accurate. */
export type VisualCategory = {
  type: HeritageType;
  label: string;
  blurb: string;
  href: string;
  image: string;
  credit: string;
  alt: string;
};

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const VISUAL_CATEGORIES: VisualCategory[] = [
  {
    type: "festival",
    label: "Festivals",
    blurb: "Seasonal gatherings — from city pujas to regional harvest rites.",
    href: "/explore?type=festival",
    image: u("photo-1587474260584-136574528ed5"),
    credit: "Photo · Unsplash",
    alt: "Crowds along a lit urban thoroughfare during a public celebration",
  },
  {
    type: "performing",
    label: "Performing arts",
    blurb: "Dance, theatre, and song still taught and staged today.",
    href: "/explore?type=performing",
    image: u("photo-1514222709107-a180c68d72b4"),
    credit: "Photo · Unsplash",
    alt: "Classical dance performance under stage light",
  },
  {
    type: "craft",
    label: "Crafts",
    blurb: "Hand skills, materials, and maker communities across regions.",
    href: "/explore?type=craft",
    image: u("photo-1590050752117-238cb0fb12b1"),
    credit: "Photo · Unsplash",
    alt: "Colourful textile patterns laid out for display",
  },
  {
    type: "oral",
    label: "Oral traditions",
    blurb: "Stories, verse, and knowledge carried by voice and lineage.",
    href: "/explore?type=oral",
    image: u("photo-1567593810070-7a3d471af022"),
    credit: "Photo · Unsplash",
    alt: "Musicians gathered outdoors with traditional instruments",
  },
  {
    type: "ritual",
    label: "Rituals",
    blurb: "Practices tied to place, season, and community — including lesser-known ones.",
    href: "/explore?type=ritual",
    image: u("photo-1605649487212-47bdab064df7"),
    credit: "Photo · Unsplash",
    alt: "Riverfront steps and lamps along a sacred landscape",
  },
  {
    type: "knowledge",
    label: "Knowledge",
    blurb: "Healing, cosmology, and living systems of knowing.",
    href: "/explore?type=knowledge",
    image: u("photo-1609137144813-7d9921338f24"),
    credit: "Photo · Unsplash",
    alt: "Quiet riverside steps and temple architecture at dawn",
  },
];

export type RegionVisual = {
  title: string;
  place: string;
  blurb: string;
  href: string;
  image: string;
  credit: string;
  alt: string;
};

/** Regional atmospheres — equal weight to North-East, coasts, desert, and Deccan. */
export const REGION_VISUALS: RegionVisual[] = [
  {
    title: "Rajasthan & desert craft",
    place: "Western India",
    blurb: "Kalbelia, metalwork, and arid-land performance traditions.",
    href: "/explore?region=rajasthan",
    image: u("photo-1477587458883-47145ed94245"),
    credit: "Photo · Unsplash",
    alt: "Amber Fort and hills near Jaipur at dusk",
  },
  {
    title: "Kerala & coastal ritual",
    place: "South-West",
    blurb: "Theyyam, temple arts, and water-linked practices.",
    href: "/explore?region=kerala",
    image: u("photo-1602216056096-3b40cc0c9944"),
    credit: "Photo · Unsplash",
    alt: "Backwaters and coconut palms in Kerala",
  },
  {
    title: "Bengal & eastern festivals",
    place: "East",
    blurb: "Durga Puja and civic festival culture in West Bengal.",
    href: "/explore?region=west-bengal",
    image: u("photo-1532375810709-75b1da00537c"),
    credit: "Photo · Unsplash",
    alt: "Howrah Bridge spanning the Hooghly at Kolkata",
  },
  {
    title: "Himalayan foothills",
    place: "North",
    blurb: "Ladakh chanting, Ramman, Yoga, Pashmina, and Kangra painting.",
    href: "/explore?q=himalaya",
    image: u("photo-1596178065887-1198b6148b2b"),
    credit: "Photo · Unsplash",
    alt: "Snow peaks and valley settlements in the Himalaya",
  },
  {
    title: "Karnataka & Deccan craft",
    place: "South / Deccan",
    blurb: "Channapatna toys and Mysore rosewood inlay — living maker traditions.",
    href: "/explore?region=karnataka",
    image: u("photo-1564507592333-c60657eea523"),
    credit: "Photo · Unsplash",
    alt: "Temple towers rising above a historic stone complex",
  },
  {
    title: "North-East highlands",
    place: "North-East",
    blurb: "Sankirtana, Bihu, and Muga silk — Assam and Manipur on equal footing.",
    href: "/explore?q=northeast",
    image: u("photo-1578662996442-48f60103fc96"),
    credit: "Photo · Unsplash",
    alt: "Mist over green hills in North-East India",
  },
];

export const HERO_IMAGE = {
  src: u("photo-1524492412937-b28074a5d7da", 1600),
  alt: "Taj Mahal and reflecting pool at Agra — a widely recognised landmark used here as atmosphere, not as a living-heritage claim",
  credit: "Photo · Unsplash",
};

export const GALLERY_STRIP = [
  {
    src: u("photo-1548013146-72479768bada", 900),
    alt: "Red Fort walls in Delhi",
    label: "Architecture",
  },
  {
    src: u("photo-1570168007204-dfb528c6958f", 900),
    alt: "Gateway of India facing the Arabian Sea",
    label: "Coastal cities",
  },
  {
    src: u("photo-1585937421612-70a008356fbe", 900),
    alt: "Indian thali with regional vegetarian dishes",
    label: "Foodways",
  },
  {
    src: u("photo-1593693411515-c20261bcad6e", 900),
    alt: "Intricate jewellery and metalwork detail",
    label: "Jewellery & metal",
  },
  {
    src: u("photo-1565557623262-b51c2513a641", 900),
    alt: "Spiced curry dishes served in metal bowls",
    label: "Cuisine",
  },
  {
    src: u("photo-1548013146-72479768bada", 900),
    alt: "Historic fort architecture in warm light",
    label: "Sacred landscapes",
  },
];
