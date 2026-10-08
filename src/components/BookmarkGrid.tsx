"use client";

import { useEffect, useState } from "react";
import { getItems } from "@/lib/catalogue";
import { ItemCard } from "@/components/ItemCard";
import { getRegionBySlug } from "@/lib/catalogue";
import { useLocalBookmarks } from "@/components/BookmarkButton";

export function BookmarkGrid() {
  const { slugs } = useLocalBookmarks();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <p>Loading bookmarks…</p>;
  const items = getItems().filter((i) => slugs.includes(i.slug));
  if (!items.length) {
    return <p className="text-[var(--ink-soft)]">No bookmarks yet. Open a card and pin it.</p>;
  }
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} region={getRegionBySlug(item.region_slug)} />
      ))}
    </div>
  );
}
