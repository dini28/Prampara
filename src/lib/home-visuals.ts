import type { HeritageType } from "@/lib/types";

/**
 * Atmosphere photographs (Unsplash) for Indian regions only.
 * Every entry must name a real India place in `region` and stay place-accurate in alt text.
 * Do not add photos without verifying the subject is in India.
 */

export type VisualCategory = {
  type: HeritageType;
  label: string;
  blurb: string;
  href: string;
  image: string;
  credit: string;
  alt: string;
  /** Verified Indian place or region shown in the photo */
  region: string;
};

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const VISUAL_CATEGORIES: VisualCategory[] = [
  {
    type: "festival",
    label: "Festivals",
    blurb: "Seasonal gatherings , from city pujas to regional harvest rites.",
    href: "/map?type=festival",
    image: u("photo-1603228254119-e6a4d095dc59"),
    credit: "Photo · Unsplash",
    alt: "Crowd throwing coloured powder during Holi celebrations in India",
    region: "India (Holi festival)",
  },
  {
    type: "performing",
    label: "Performing arts",
    blurb: "Dance, theatre, and song still taught and staged today.",
    href: "/map?type=performing",
    image: u("photo-1786644849913-8107d8179364"),
    credit: "Photo · Unsplash",
    alt: "Kathakali performer in traditional costume and makeup in Kerala",
    region: "Kerala",
  },
  {
    type: "craft",
    label: "Crafts",
    blurb: "Hand skills, materials, and maker communities across regions.",
    href: "/map?type=craft",
    image: u("photo-1616606484004-5ef3cc46e39d"),
    credit: "Photo · Unsplash",
    alt: "Stone chariot at the Vittala Temple complex in Hampi, Karnataka",
    region: "Hampi, Karnataka",
  },
  {
    type: "oral",
    label: "Oral traditions",
    blurb: "Stories, verse, and knowledge carried by voice and lineage.",
    href: "/map?type=oral",
    image: u("photo-1561359313-0639aad49ca6"),
    credit: "Photo · Unsplash",
    alt: "Boats on the Ganges before stone ghats and temples in Varanasi",
    region: "Varanasi, Uttar Pradesh",
  },
  {
    type: "ritual",
    label: "Rituals",
    blurb: "Practices tied to place, season, and community , including lesser-known ones.",
    href: "/map?type=ritual",
    image: u("photo-1705952484283-19c31e37e0e4"),
    credit: "Photo · Unsplash",
    alt: "People performing a ritual with oil lamps on the Ganges in Varanasi",
    region: "Varanasi, Uttar Pradesh",
  },
  {
    type: "knowledge",
    label: "Knowledge",
    blurb: "Healing, cosmology, and living systems of knowing.",
    href: "/map?type=knowledge",
    image: u("photo-1620766182966-c6eb5ed2b788"),
    credit: "Photo · Unsplash",
    alt: "Virupaksha Temple tower rising above stone ruins in Hampi, Karnataka",
    region: "Hampi, Karnataka",
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
  region: string;
};

/** Regional atmospheres , equal weight to North-East, coasts, desert, and Deccan. */
export const REGION_VISUALS: RegionVisual[] = [
  {
    title: "Rajasthan & desert craft",
    place: "Western India",
    blurb: "Kalbelia, metalwork, and arid-land performance traditions.",
    href: "/map?region=rajasthan",
    image: u("photo-1477587458883-47145ed94245"),
    credit: "Photo · Unsplash",
    alt: "Amber Fort and hills near Jaipur at dusk",
    region: "Jaipur, Rajasthan",
  },
  {
    title: "Kerala & coastal ritual",
    place: "South-West",
    blurb: "Theyyam, temple arts, and water-linked practices.",
    href: "/map?region=kerala",
    image: u("photo-1602216056096-3b40cc0c9944"),
    credit: "Photo · Unsplash",
    alt: "Backwaters and coconut palms in Kerala",
    region: "Kerala",
  },
  {
    title: "Bengal & eastern festivals",
    place: "East",
    blurb: "Durga Puja and civic festival culture in West Bengal.",
    href: "/map?region=west-bengal",
    image: u("photo-1532375810709-75b1da00537c"),
    credit: "Photo · Unsplash",
    alt: "Howrah Bridge spanning the Hooghly at Kolkata",
    region: "Kolkata, West Bengal",
  },
  {
    title: "Himalayan foothills",
    place: "North",
    blurb: "Ladakh chanting, Ramman, Yoga, Pashmina, and Kangra painting.",
    href: "/map?region=ladakh",
    image: u("photo-1619837374214-f5b9eb80876d"),
    credit: "Photo · Unsplash",
    alt: "Confluence of the Indus and Zanskar rivers in Ladakh",
    region: "Ladakh",
  },
  {
    title: "Karnataka & Deccan craft",
    place: "South / Deccan",
    blurb: "Channapatna toys and Mysore rosewood inlay , living maker traditions.",
    href: "/map?region=karnataka",
    image: u("photo-1620766182966-c6eb5ed2b788"),
    credit: "Photo · Unsplash",
    alt: "Virupaksha Temple gopuram at Hampi, Karnataka",
    region: "Hampi, Karnataka",
  },
  {
    title: "North-East highlands",
    place: "North-East",
    blurb: "Sankirtana, Bihu, and Muga silk , Assam and Manipur on equal footing.",
    href: "/map?region=assam",
    image: u("photo-1615472910606-9d4f7291944f"),
    credit: "Photo · Unsplash",
    alt: "Tea pluckers working among shade trees on an Assam tea estate",
    region: "Assam",
  },
];

export const HERO_IMAGE = {
  src: u("photo-1691075221845-687ff5614e66", 1600),
  alt: "Kathakali performer in Kerala , living heritage performance rather than monument tourism",
  credit: "Photo · Unsplash",
  region: "Kerala",
};

export const GALLERY_STRIP = [
  {
    src: u("photo-1548013146-72479768bada", 900),
    alt: "Red Fort walls in Delhi",
    label: "Delhi",
    region: "Delhi",
  },
  {
    src: u("photo-1570168007204-dfb528c6958f", 900),
    alt: "Gateway of India facing the Arabian Sea in Mumbai",
    label: "Mumbai",
    region: "Mumbai, Maharashtra",
  },
  {
    src: u("photo-1585937421612-70a008356fbe", 900),
    alt: "Indian thali with regional vegetarian dishes",
    label: "Foodways",
    region: "India (cuisine)",
  },
  {
    src: u("photo-1599661046289-e31897846e41", 900),
    alt: "Lake palace and cityscape in Udaipur, Rajasthan",
    label: "Udaipur",
    region: "Udaipur, Rajasthan",
  },
  {
    src: u("photo-1581793745862-99fde7fa73d2", 900),
    alt: "Motorcyclist on a high mountain road through Ladakh",
    label: "Ladakh",
    region: "Ladakh",
  },
  {
    src: u("photo-1561361058-c24cecae35ca", 900),
    alt: "Boats moored at stone ghats on the Ganges in Varanasi",
    label: "Varanasi",
    region: "Varanasi, Uttar Pradesh",
  },
];
