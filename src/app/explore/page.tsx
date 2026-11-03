import Image from "next/image";
import Link from "next/link";
import { ItemCard } from "@/components/ItemCard";
import { LoopStepper } from "@/components/LoopStepper";
import { UserNeedBanner } from "@/components/UserNeedBanner";
import {
  TYPE_LABEL,
  countByType,
  filterItems,
  getItems,
  getRegions,
} from "@/lib/catalogue";
import { VISUAL_CATEGORIES } from "@/lib/home-visuals";
import type { HeritageType } from "@/lib/types";

function buildExploreHref(parts: {
  q?: string;
  type?: string;
  region?: string;
  badge?: string;
}) {
  const sp = new URLSearchParams();
  if (parts.q) sp.set("q", parts.q);
  if (parts.type && parts.type !== "all") sp.set("type", parts.type);
  if (parts.region) sp.set("region", parts.region);
  if (parts.badge) sp.set("badge", parts.badge);
  const qs = sp.toString();
  return qs ? `/explore?${qs}` : "/explore";
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; region?: string; badge?: string }>;
}) {
  const sp = await searchParams;
  const type = (sp.type as HeritageType | "all" | undefined) || "all";
  const badge = sp.badge ?? "";
  const regionSlug = sp.region ?? "";
  const q = sp.q?.trim() ?? "";

  const items = filterItems({
    q,
    type,
    region: regionSlug || undefined,
    unesco: badge === "unesco",
    gi: badge === "gi",
  });

  const regions = getRegions();
  const allItems = getItems();
  const typeCounts = countByType();
  const regionCounts = new Map<string, number>();
  for (const item of allItems) {
    regionCounts.set(item.region_slug, (regionCounts.get(item.region_slug) ?? 0) + 1);
  }
  const regionsWithCards = regions
    .filter((r) => (regionCounts.get(r.slug) ?? 0) > 0)
    .sort((a, b) => (regionCounts.get(b.slug) ?? 0) - (regionCounts.get(a.slug) ?? 0));

  const activeRegion = regionSlug ? regions.find((r) => r.slug === regionSlug) : undefined;
  const hasFilters = Boolean(q || (type && type !== "all") || regionSlug || badge);

  const activeChips: { label: string; clearHref: string }[] = [];
  if (q) {
    activeChips.push({
      label: `Search: “${q}”`,
      clearHref: buildExploreHref({ type, region: regionSlug, badge }),
    });
  }
  if (type && type !== "all") {
    activeChips.push({
      label: TYPE_LABEL[type as HeritageType] ?? type,
      clearHref: buildExploreHref({ q, region: regionSlug, badge }),
    });
  }
  if (activeRegion) {
    activeChips.push({
      label: activeRegion.name,
      clearHref: buildExploreHref({ q, type, badge }),
    });
  }
  if (badge === "unesco") {
    activeChips.push({
      label: "UNESCO listed",
      clearHref: buildExploreHref({ q, type, region: regionSlug }),
    });
  }
  if (badge === "gi") {
    activeChips.push({
      label: "GI tag",
      clearHref: buildExploreHref({ q, type, region: regionSlug }),
    });
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <LoopStepper current="discover" />
      <div className="mt-6">
        <UserNeedBanner ids={["UR-01", "UR-02"]} />
      </div>

      <h1 className="serif mt-8 text-5xl">Explore by place or theme</h1>
      <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
        Step 1 of the loop: {allItems.length} published cards across{" "}
        {regionsWithCards.length} regions — filter by type, place, or badge, then open a card for
        Ask → Quiz → Contribute.
      </p>

      <section className="mt-8" aria-label="Browse by heritage type">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {VISUAL_CATEGORIES.map((cat) => {
            const count = typeCounts[cat.type];
            const active = type === cat.type;
            return (
              <Link
                key={cat.type}
                href={buildExploreHref({
                  q,
                  type: active ? "all" : cat.type,
                  region: regionSlug,
                  badge,
                })}
                className={`visual-card group relative block aspect-[16/9] ${
                  active ? "outline-[var(--primary)]" : ""
                }`}
                aria-current={active ? "true" : undefined}
              >
                <Image
                  src={cat.image}
                  alt={cat.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="visual-card-overlay absolute inset-0" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <h2 className="serif text-xl">{cat.label}</h2>
                      <p className="mt-0.5 text-xs text-white/75">{cat.blurb}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium tabular-nums backdrop-blur-sm">
                      {count}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <form
        className="mt-8 grid gap-3 rounded-2xl bg-[var(--surface)] p-4 outline outline-1 outline-[var(--line)] md:grid-cols-4"
        action="/explore"
        method="get"
      >
        <input
          name="q"
          defaultValue={q}
          placeholder="Search title, place, tags…"
          aria-label="Search cards"
          className="min-h-12 rounded-xl bg-[var(--bg)] px-4 py-3 outline outline-1 outline-[var(--line)] placeholder:text-[var(--muted)]"
        />
        <select
          name="type"
          defaultValue={type}
          aria-label="Heritage type"
          className="min-h-12 rounded-xl bg-[var(--bg)] px-4 py-3 outline outline-1 outline-[var(--line)]"
        >
          <option value="all">All types ({allItems.length})</option>
          {(Object.keys(TYPE_LABEL) as HeritageType[]).map((k) => (
            <option key={k} value={k}>
              {TYPE_LABEL[k]} ({typeCounts[k]})
            </option>
          ))}
        </select>
        <select
          name="region"
          defaultValue={regionSlug}
          aria-label="Region"
          className="min-h-12 rounded-xl bg-[var(--bg)] px-4 py-3 outline outline-1 outline-[var(--line)]"
        >
          <option value="">All regions ({regionsWithCards.length})</option>
          {regionsWithCards.map((r) => (
            <option key={r.id} value={r.slug}>
              {r.name} ({regionCounts.get(r.slug)})
            </option>
          ))}
        </select>
        <select
          name="badge"
          defaultValue={badge}
          aria-label="Badge filter"
          className="min-h-12 rounded-xl bg-[var(--bg)] px-4 py-3 outline outline-1 outline-[var(--line)]"
        >
          <option value="">Any badge</option>
          <option value="unesco">
            UNESCO ({allItems.filter((i) => i.unesco_id).length})
          </option>
          <option value="gi">GI tag ({allItems.filter((i) => i.gi_flag).length})</option>
        </select>
        <div className="flex flex-wrap items-center gap-3 md:col-span-4">
          <button
            type="submit"
            className="btn min-h-11 rounded-full bg-[var(--primary)] px-6 text-[var(--on-primary)] hover:bg-[var(--primary-hover)]"
          >
            Apply filters
          </button>
          {hasFilters ? (
            <Link
              href="/explore"
              className="min-h-11 content-center text-sm text-[var(--primary)] underline underline-offset-4 hover:text-[var(--primary-hover)]"
            >
              Clear all
            </Link>
          ) : null}
        </div>
      </form>

      {activeChips.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Active filters">
          {activeChips.map((chip) => (
            <li key={chip.label}>
              <Link
                href={chip.clearHref}
                className="inline-flex min-h-9 items-center gap-2 rounded-full bg-[var(--primary-tint)] px-3 text-sm text-[var(--primary-deep)] hover:outline hover:outline-1 hover:outline-[var(--primary)]"
              >
                <span>{chip.label}</span>
                <span aria-hidden="true">×</span>
                <span className="sr-only">Remove filter</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-6 text-sm text-[var(--ink-soft)]">
        <span className="font-medium text-[var(--ink)] tabular-nums">{items.length}</span>
        {items.length === 1 ? " card matches" : " cards match"}
        {hasFilters ? " these filters" : " published"}
      </p>

      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-[var(--surface)] p-8 text-center outline outline-1 outline-[var(--line)]">
          <p className="serif text-2xl">No cards match</p>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            Try another type or region — every published card is still in the catalogue.
          </p>
          <Link
            href="/explore"
            className="btn mt-5 inline-flex min-h-11 items-center rounded-full bg-[var(--primary)] px-5 text-[var(--on-primary)] hover:bg-[var(--primary-hover)]"
          >
            Show all {allItems.length} cards
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              region={regions.find((r) => r.slug === item.region_slug)}
            />
          ))}
        </div>
      )}

      <section className="mt-14" aria-labelledby="regions-heading">
        <h2 id="regions-heading" className="serif text-3xl">
          Regions with cards
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-soft)]">
          Only places that currently have published cards. Selecting a chip filters this page;
          open the region name for a place-first entry.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {regionsWithCards.map((r) => {
            const count = regionCounts.get(r.slug) ?? 0;
            const active = regionSlug === r.slug;
            return (
              <div key={r.id} className="inline-flex overflow-hidden rounded-full outline outline-1 outline-[var(--line)]">
                <Link
                  href={buildExploreHref({
                    q,
                    type,
                    region: active ? undefined : r.slug,
                    badge,
                  })}
                  className={`inline-flex min-h-10 items-center gap-2 px-4 text-sm ${
                    active
                      ? "bg-[var(--primary)] text-[var(--on-primary)]"
                      : "bg-[var(--bg)] hover:bg-[var(--surface)]"
                  }`}
                  aria-current={active ? "true" : undefined}
                >
                  {r.name}
                  <span className={`tabular-nums ${active ? "text-white/80" : "text-[var(--muted)]"}`}>
                    {count}
                  </span>
                </Link>
                <Link
                  href={`/regions/${r.slug}`}
                  className={`inline-flex min-h-10 items-center border-l px-3 text-xs ${
                    active
                      ? "border-white/25 bg-[var(--primary-hover)] text-white/90"
                      : "border-[var(--line)] bg-[var(--surface)] text-[var(--primary)] hover:underline"
                  }`}
                  title={`Open ${r.name} place page`}
                >
                  Place
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
