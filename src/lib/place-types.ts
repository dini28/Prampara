import type { Source } from "@/lib/types";

export type DestinationKind = "state" | "city";

export type PlaceCategory =
  | "heritage_site"
  | "living_tradition"
  | "craft_street"
  | "market"
  | "nature"
  | "modern_space"
  | "temple"
  | "palace";

export type ExperienceType = "food" | "travel" | "stay_tip" | "event";

export type DietaryLabel =
  | "vegetarian"
  | "vegan_friendly"
  | "jain_friendly"
  | "non_vegetarian"
  | "halal_options";

export type ModernTheme =
  | "design"
  | "startup"
  | "art"
  | "music"
  | "sustainability"
  | "infrastructure"
  | "cafe";

export type Destination = {
  id: string;
  slug: string;
  kind: DestinationKind;
  name: string;
  /** Parent state slug when kind is city */
  parent_slug: string | null;
  state_ut: string;
  lat: number;
  lng: number;
  summary: string;
  /** Short state/city culture overview sections (state story layers) */
  story_sections?: {
    id: string;
    title: string;
    body: string;
    related_card_slugs?: string[];
  }[];
  hero_image: {
    src: string;
    alt: string;
    credit: string;
  };
  related_card_slugs: string[];
};

export type Place = {
  id: string;
  slug: string;
  destination_slug: string;
  name: string;
  category: PlaceCategory;
  /** Two plain sentences */
  what_it_is: string;
  /** Why it matters */
  why_it_matters: string;
  /** What to notice on site */
  what_to_notice: string[];
  respectful_visit: string;
  lat: number;
  lng: number;
  route_order?: number;
  lesser_known?: boolean;
  /** Nearby lesser-known place slugs for crowd relief */
  nearby_lesser_known_slugs?: string[];
  related_card_slugs?: string[];
  sensitivity_flag?: boolean;
  sources: Source[];
  last_verified: string;
  give_back?: {
    tips: string[];
    official_support_links?: { label: string; url: string }[];
  };
};

export type Experience = {
  id: string;
  slug: string;
  destination_slug: string;
  type: ExperienceType;
  title: string;
  story: string;
  details: string;
  dietary_labels?: DietaryLabel[];
  related_place_slugs?: string[];
  sources: Source[];
  last_verified: string;
};

export type ModernItem = {
  id: string;
  slug: string;
  destination_slug: string;
  theme: ModernTheme;
  title: string;
  summary: string;
  related_place_slugs?: string[];
  related_card_slugs?: string[];
  sources: Source[];
  last_verified: string;
};

export type Meaning = {
  id: string;
  slug: string;
  name: string;
  object_type: string;
  /** Keywords for photo / hint matching (never invented meanings) */
  visual_hints: string[];
  destination_slugs: string[];
  symbolises: string;
  community_context: string;
  sentiment: string;
  sensitivity_flag?: boolean;
  related_place_slugs?: string[];
  related_card_slugs?: string[];
  sources: Source[];
};

export type ItineraryStop = {
  order: number;
  title: string;
  kind: "heritage" | "food" | "modern" | "travel";
  place_slug?: string;
  experience_slug?: string;
  modern_slug?: string;
  note: string;
};

export type Itinerary = {
  id: string;
  slug: string;
  destination_slug: string;
  title: string;
  duration_days: 1 | 2;
  summary: string;
  stops: ItineraryStop[];
  sources: Source[];
};

export type DestinationBundle = {
  destination: Destination;
  places: Place[];
  experiences: Experience[];
  modern_items: ModernItem[];
  meanings: Meaning[];
  itineraries: Itinerary[];
};

export type LocalPartner = {
  id: string;
  destination_slug: string;
  kind: "artisan" | "community_experience" | "family_eatery" | "certified_guide";
  name: string;
  tip: string;
  related_place_slugs?: string[];
  sources: Source[];
  last_verified: string;
};
