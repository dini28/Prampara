export type StateIdentity = {
  slug: string;
  name: string;
  greeting: string;
  fact: string;
  /** Accent hue for the loader (oklch hue) */
  hue: number;
  motif: "desert" | "coast" | "hills" | "river" | "delta" | "plateau" | "default";
};

const DEFAULT: StateIdentity = {
  slug: "india",
  name: "India",
  greeting: "Namaste",
  fact: "Living heritage spans festivals, crafts, performance, and oral memory , not only famous cities.",
  hue: 255,
  motif: "default",
};

const BY_SLUG: Record<string, StateIdentity> = {
  rajasthan: {
    slug: "rajasthan",
    name: "Rajasthan",
    greeting: "Khamma ghani",
    fact: "Kalbelia song-and-dance is UNESCO-listed living heritage of Kalbelia communities , not a costume souvenir.",
    hue: 35,
    motif: "desert",
  },
  gujarat: {
    slug: "gujarat",
    name: "Gujarat",
    greeting: "Kem cho",
    fact: "Garba and Ajrakh sit in the same coastal to desert craft corridor as everyday ritual calendars.",
    hue: 45,
    motif: "coast",
  },
  "west-bengal": {
    slug: "west-bengal",
    name: "West Bengal",
    greeting: "Nomoshkar",
    fact: "Durga Puja neighbourhoods turn streets into temporary sacred theatres every autumn.",
    hue: 280,
    motif: "delta",
  },
  kerala: {
    slug: "kerala",
    name: "Kerala",
    greeting: "Namaskaram",
    fact: "Kutiyattam and Theyyam keep temple-linked performance lineages alive beyond tourist stages.",
    hue: 155,
    motif: "coast",
  },
  "tamil-nadu": {
    slug: "tamil-nadu",
    name: "Tamil Nadu",
    greeting: "Vanakkam",
    fact: "Kanchipuram weaving and Pongal mark living practice, not only temple tourism.",
    hue: 25,
    motif: "coast",
  },
  odisha: {
    slug: "odisha",
    name: "Odisha",
    greeting: "Namaskar",
    fact: "Chhau and Pattachitra travel coastal to tribal belts that rarely make city guides.",
    hue: 200,
    motif: "coast",
  },
  manipur: {
    slug: "manipur",
    name: "Manipur",
    greeting: "Khurumjari",
    fact: "Sankirtana binds court to temple performance lineages in the North-East.",
    hue: 145,
    motif: "hills",
  },
  punjab: {
    slug: "punjab",
    name: "Punjab",
    greeting: "Sat sri akaal",
    fact: "Thathera metalcraft at Jandiala Guru is GI-linked living craft knowledge.",
    hue: 55,
    motif: "river",
  },
  uttarakhand: {
    slug: "uttarakhand",
    name: "Uttarakhand",
    greeting: "Namaskar",
    fact: "Himalayan ritual calendars and oral traditions sit beside better-known pilgrimage routes.",
    hue: 210,
    motif: "hills",
  },
  karnataka: {
    slug: "karnataka",
    name: "Karnataka",
    greeting: "Namaskara",
    fact: "Deccan craft and performance corridors extend far beyond Bengaluru.",
    hue: 30,
    motif: "plateau",
  },
  maharashtra: {
    slug: "maharashtra",
    name: "Maharashtra",
    greeting: "Namaskar",
    fact: "Warli and coastal to Deccan practices share space with megacity culture.",
    hue: 250,
    motif: "plateau",
  },
  telangana: {
    slug: "telangana",
    name: "Telangana",
    greeting: "Namaskaram",
    fact: "Deccan oral and craft traditions continue outside Hyderabad’s spotlight.",
    hue: 20,
    motif: "plateau",
  },
  "andhra-pradesh": {
    slug: "andhra-pradesh",
    name: "Andhra Pradesh",
    greeting: "Namaskaram",
    fact: "Coastal and Deccan living practices include crafts rarely listed in city itineraries.",
    hue: 40,
    motif: "coast",
  },
  bihar: {
    slug: "bihar",
    name: "Bihar",
    greeting: "Pranam",
    fact: "Madhubani and village ritual arts carry mythic narratives beyond monument tourism.",
    hue: 15,
    motif: "river",
  },
  "uttar-pradesh": {
    slug: "uttar-pradesh",
    name: "Uttar Pradesh",
    greeting: "Namaste",
    fact: "Kumbh geography rotates; living practice is not “one city property.”",
    hue: 265,
    motif: "river",
  },
  assam: {
    slug: "assam",
    name: "Assam",
    greeting: "Nomoskar",
    fact: "Bihu and North-East performance lineages sit beside tea-country stereotypes.",
    hue: 140,
    motif: "river",
  },
  ladakh: {
    slug: "ladakh",
    name: "Ladakh",
    greeting: "Juley",
    fact: "High-altitude ritual calendars ask for respectful visiting, not spectacle tourism.",
    hue: 220,
    motif: "hills",
  },
  "jammu-kashmir": {
    slug: "jammu-kashmir",
    name: "Jammu & Kashmir",
    greeting: "Adaab",
    fact: "Craft and oral traditions continue under careful, non-sensational framing.",
    hue: 230,
    motif: "hills",
  },
  "himachal-pradesh": {
    slug: "himachal-pradesh",
    name: "Himachal Pradesh",
    greeting: "Namaste",
    fact: "Hill deity processions and local crafts outlast guidebook checklists.",
    hue: 195,
    motif: "hills",
  },
  chhattisgarh: {
    slug: "chhattisgarh",
    name: "Chhattisgarh",
    greeting: "Johar",
    fact: "Village performance and craft belts are central , not an afterthought to cities.",
    hue: 70,
    motif: "plateau",
  },
};

export function getStateIdentity(slug: string | null | undefined): StateIdentity {
  if (!slug) return DEFAULT;
  return BY_SLUG[slug] ?? {
    ...DEFAULT,
    slug,
    name: slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
  };
}

export function getDefaultStateIdentity() {
  return DEFAULT;
}
