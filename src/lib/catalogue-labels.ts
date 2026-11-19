import type { HeritageType } from "@/lib/types";

/** Client-safe labels (no JSON import). */
export const TYPE_LABEL: Record<HeritageType, string> = {
  festival: "Festival",
  craft: "Craft",
  performing: "Performing arts",
  oral: "Oral tradition",
  ritual: "Ritual",
  knowledge: "Knowledge system",
};
