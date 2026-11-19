"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { HeritageType } from "@/lib/types";
import { TYPE_LABEL } from "@/lib/catalogue-labels";

function hrefFor(parts: {
  q?: string;
  type?: string;
  region?: string;
  badge?: string;
  sort?: string;
}) {
  const sp = new URLSearchParams();
  if (parts.q) sp.set("q", parts.q);
  if (parts.type && parts.type !== "all") sp.set("type", parts.type);
  if (parts.region) sp.set("region", parts.region);
  if (parts.badge) sp.set("badge", parts.badge);
  if (parts.sort && parts.sort !== "az") sp.set("sort", parts.sort);
  const qs = sp.toString();
  return qs ? `/explore?${qs}` : "/explore";
}

export function ExploreInstantFilters({
  q,
  type,
  regionSlug,
  badge,
  sort,
  allCount,
  typeCounts,
  regionsWithCards,
  regionCounts,
  unescoCount,
  giCount,
}: {
  q: string;
  type: string;
  regionSlug: string;
  badge: string;
  sort: string;
  allCount: number;
  typeCounts: Record<string, number>;
  regionsWithCards: { id: string; slug: string; name: string }[];
  regionCounts: Record<string, number>;
  unescoCount: number;
  giCount: number;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function go(next: Partial<{ q: string; type: string; region: string; badge: string; sort: string }>) {
    start(() => {
      router.push(
        hrefFor({
          q: next.q ?? q,
          type: next.type ?? type,
          region: next.region ?? regionSlug,
          badge: next.badge ?? badge,
          sort: next.sort ?? sort,
        }),
      );
    });
  }

  return (
    <div
      className={`sticky top-14 z-20 grid gap-3 rounded-2xl bg-[var(--bg-veil)] p-4 outline outline-1 outline-[var(--line)] backdrop-blur-md md:grid-cols-5 ${
        pending ? "opacity-80" : ""
      }`}
    >
      <input
        defaultValue={q}
        placeholder="Search title, place, tags…"
        aria-label="Search cards"
        className="min-h-12 rounded-xl bg-[var(--bg)] px-4 py-3 outline outline-1 outline-[var(--line)] placeholder:text-[var(--muted)] md:col-span-2"
        onChange={(e) => {
          const value = e.target.value;
          window.clearTimeout((window as unknown as { __ppExploreT?: number }).__ppExploreT);
          (window as unknown as { __ppExploreT?: number }).__ppExploreT = window.setTimeout(() => {
            go({ q: value });
          }, 280);
        }}
      />
      <select
        value={type}
        aria-label="Heritage type"
        className="min-h-12 rounded-xl bg-[var(--bg)] px-4 py-3 outline outline-1 outline-[var(--line)]"
        onChange={(e) => go({ type: e.target.value })}
      >
        <option value="all">All types ({allCount})</option>
        {(Object.keys(TYPE_LABEL) as HeritageType[]).map((k) => (
          <option key={k} value={k}>
            {TYPE_LABEL[k]} ({typeCounts[k] ?? 0})
          </option>
        ))}
      </select>
      <select
        value={regionSlug}
        aria-label="Region"
        className="min-h-12 rounded-xl bg-[var(--bg)] px-4 py-3 outline outline-1 outline-[var(--line)]"
        onChange={(e) => go({ region: e.target.value })}
      >
        <option value="">All regions ({regionsWithCards.length})</option>
        {regionsWithCards.map((r) => (
          <option key={r.id} value={r.slug}>
            {r.name} ({regionCounts[r.slug] ?? 0})
          </option>
        ))}
      </select>
      <select
        value={badge}
        aria-label="Badge filter"
        className="min-h-12 rounded-xl bg-[var(--bg)] px-4 py-3 outline outline-1 outline-[var(--line)]"
        onChange={(e) => go({ badge: e.target.value })}
      >
        <option value="">Any badge</option>
        <option value="unesco">UNESCO ICH ({unescoCount})</option>
        <option value="gi">GI tag ({giCount})</option>
      </select>
      <select
        value={sort}
        aria-label="Sort cards"
        className="min-h-12 rounded-xl bg-[var(--bg)] px-4 py-3 outline outline-1 outline-[var(--line)] md:col-span-2"
        onChange={(e) => go({ sort: e.target.value })}
      >
        <option value="az">Sort A to Z</option>
        <option value="region">Sort by region</option>
        <option value="unesco">UNESCO first</option>
      </select>
    </div>
  );
}
