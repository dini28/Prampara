"use client";

import { useEffect } from "react";
import { regionSlugToStateSlug } from "@/lib/india-states";
import { visitTreasure } from "@/lib/learner-progress";

/** Records an on-device visit + state unlock when a treasure card opens. */
export function VisitTreasure({
  itemSlug,
  regionSlug,
}: {
  itemSlug: string;
  regionSlug: string;
}) {
  useEffect(() => {
    const stateSlug = regionSlugToStateSlug(regionSlug);
    visitTreasure(itemSlug, stateSlug);
  }, [itemSlug, regionSlug]);

  return null;
}
