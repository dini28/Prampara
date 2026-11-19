import Image from "next/image";
import Link from "next/link";
import { ExploreInstantFilters } from "@/components/ExploreInstantFilters";
import { ItemCard } from "@/components/ItemCard";
import { LoopStepper } from "@/components/LoopStepper";
import { PageShell } from "@/components/PageShell";
import { PullToRefresh } from "@/components/PullToRefresh";
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

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    type?: string;
    region?: string;
    badge?: string;
    sort?: string;
  }>;
}) {
  const sp = await searchParams;
  const type = (sp.type as HeritageType | "all" | undefined) || "all";
  const badge = sp.badge ?? "";
  const regionSlug = sp.region ?? "";
  const q = sp.q?.trim() ?? "";
  const sort = sp.sort ?? "az";

  let items = filterItems({
    q,
    type,
    region: regionSlug || undefined,
    unesco: badge === "unesco",
    gi: badge === "gi",
  });

  if (sort === "region") {
    items = [...items].sort((a, b) =>
      a.region_slug.localeCompare(b.region_slug) || a.title.localeCompare(b.title),
    );
  } else if (sort === "unesco") {
    items = [...items].sort((a, b) => {
      const au = a.unesco_id ? 0 : 1;
      const bu = b.unesco_id ? 0 : 1;
      return au - bu || a.title.localeCompare(b.title);
    });
  } else {
    items = [...items].sort((a, b) => a.title.localeCompare(b.title));
  }

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
      clearHref: buildExploreHref({ type, region: regionSlug, badge, sort }),
    });
  }
  if (type && type !== "all") {
    activeChips.push({
      label: TYPE_LABEL[type as HeritageType] ?? type,
      clearHref: buildExploreHref({ q, region: regionSlug, badge, sort }),
    });
  }
  if (activeRegion) {
    activeChips.push({
      label: activeRegion.name,
      clearHref: buildExploreHref({ q, type, badge, sort }),
    });
  }
  if (badge === "unesco") {
    activeChips.push({
      label: "UNESCO ICH",
      clearHref: buildExploreHref({ q, type, region: regionSlug, sort }),
    });
  }
  if (badge === "gi") {
    activeChips.push({
      label: "GI tag",
      clearHref: buildExploreHref({ q, type, region: regionSlug, sort }),
    });
  }

  return (
    <PullToRefresh>
      <PageShell
        width="wide"
        before={
          <div className="sticky-mini-header -mx-5 px-5 py-3 md:static md:mx-0 md:bg-transparent md:p-0">
            <LoopStepper current="discover" />
          </div>
        }
        crumbs={[{ href: "/", label: "Home" }, { label: "Explore" }]}
        eyebrow="Discover · cards and places"
        title="Explore by place or theme"
        lead={`${allItems.length} published cards across ${regionsWithCards.length} regions. Filters apply instantly. Then open a card for Ask, Quiz, and Contribute.`}
        nextHref="/places"
        nextLabel="Open place guides"
        secondaryHref="/map"
        secondaryLabel="Explore the map of practices"
      >
        <section aria-label="Browse by heritage type">
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
                    sort,
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

        <div className="mt-8">
          <ExploreInstantFilters
            q={q}
            type={type}
            regionSlug={regionSlug}
            badge={badge}
            sort={sort}
            allCount={allItems.length}
            typeCounts={typeCounts}
            regionsWithCards={regionsWithCards.map((r) => ({
              id: r.id,
              slug: r.slug,
              name: r.name,
            }))}
            regionCounts={Object.fromEntries(regionCounts)}
            unescoCount={allItems.filter((i) => i.unesco_id).length}
            giCount={allItems.filter((i) => i.gi_flag).length}
          />
        </div>

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
              Try another type or region. Every published card is still in the catalogue. Or open the{" "}
              <Link href="/places/udaipur" className="text-[var(--primary)] underline">
                Udaipur place guide
              </Link>
              .
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
          <div className="mt-5 flex flex-wrap gap-2">
            {regionsWithCards.map((r) => {
              const count = regionCounts.get(r.slug) ?? 0;
              const active = regionSlug === r.slug;
              return (
                <div
                  key={r.id}
                  className="inline-flex overflow-hidden rounded-full outline outline-1 outline-[var(--line)]"
                >
                  <Link
                    href={buildExploreHref({
                      q,
                      type,
                      region: active ? undefined : r.slug,
                      badge,
                      sort,
                    })}
                    className={`inline-flex min-h-10 items-center gap-2 px-4 text-sm ${
                      active
                        ? "bg-[var(--primary)] text-[var(--on-primary)]"
                        : "bg-[var(--bg)] hover:bg-[var(--surface)]"
                    }`}
                  >
                    {r.name}
                    <span className={`tabular-nums ${active ? "text-white/80" : "text-[var(--muted)]"}`}>
                      {count}
                    </span>
                  </Link>
                  <Link
                    href={
                      r.slug === "rajasthan" ? "/places/rajasthan" : `/regions/${r.slug}`
                    }
                    className={`inline-flex min-h-10 items-center border-l px-3 text-xs ${
                      active
                        ? "border-white/25 bg-[var(--primary-hover)] text-white/90"
                        : "border-[var(--line)] bg-[var(--surface)] text-[var(--primary)] hover:underline"
                    }`}
                  >
                    Place
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </PageShell>
    </PullToRefresh>
  );
}
