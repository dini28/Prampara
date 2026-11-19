"use client";

import { useEffect, useState } from "react";

export function SaveItineraryButton({
  itinerarySlug,
  title,
}: {
  itinerarySlug: string;
  title: string;
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("pp_saved_itineraries");
      const list = raw ? (JSON.parse(raw) as string[]) : [];
      setSaved(list.includes(itinerarySlug));
    } catch {
      setSaved(false);
    }
  }, [itinerarySlug]);

  function toggle() {
    const raw = window.localStorage.getItem("pp_saved_itineraries");
    const list: string[] = raw ? JSON.parse(raw) : [];
    const next = list.includes(itinerarySlug)
      ? list.filter((s) => s !== itinerarySlug)
      : [...list, itinerarySlug];
    window.localStorage.setItem("pp_saved_itineraries", JSON.stringify(next));
    const metaRaw = window.localStorage.getItem("pp_saved_itinerary_meta");
    const meta: Record<string, string> = metaRaw ? JSON.parse(metaRaw) : {};
    if (next.includes(itinerarySlug)) meta[itinerarySlug] = title;
    else delete meta[itinerarySlug];
    window.localStorage.setItem("pp_saved_itinerary_meta", JSON.stringify(meta));
    setSaved(next.includes(itinerarySlug));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="btn inline-flex min-h-11 items-center rounded-full border border-[var(--line-strong)] px-4 text-sm hover:border-[var(--primary)]"
      aria-pressed={saved}
    >
      {saved ? "Saved on this device" : "Save itinerary"}
    </button>
  );
}
