"use client";

import { useEffect, useState } from "react";

const KEY = "pp_bookmarks";

export function useLocalBookmarks() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setSlugs(JSON.parse(raw) as string[]);
  }, []);

  function toggle(slug: string) {
    setSlugs((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  return { slugs, toggle, has: (slug: string) => slugs.includes(slug) };
}

export function BookmarkButton({ slug }: { slug: string }) {
  const { toggle, has } = useLocalBookmarks();
  const on = has(slug);
  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      className="btn rounded-full border border-[var(--line)] px-4 py-1.5 text-sm"
    >
      {on ? "Bookmarked" : "Bookmark"}
    </button>
  );
}
