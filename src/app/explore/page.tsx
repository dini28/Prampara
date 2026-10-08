import { ItemCard } from "@/components/ItemCard";
import { filterItems, getRegions, TYPE_LABEL } from "@/lib/catalogue";
import type { HeritageType } from "@/lib/types";
import Link from "next/link";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; region?: string; badge?: string }>;
}) {
  const sp = await searchParams;
  const badge = sp.badge;
  const items = filterItems({
    q: sp.q,
    type: (sp.type as HeritageType | "all") || "all",
    region: sp.region,
    unesco: badge === "unesco",
    gi: badge === "gi",
  });
  const regions = getRegions();

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="serif text-5xl">Explore</h1>
      <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
        Forty curated cards. Not a national encyclopedia. Filter by region, type, UNESCO, or GI frame.
      </p>
      <form className="mt-8 grid gap-3 rounded-[28px] bg-[var(--paper-2)] p-4 md:grid-cols-4" action="/explore">
        <input
          name="q"
          defaultValue={sp.q}
          placeholder="Search title or body"
          className="rounded-2xl bg-[var(--paper)] px-4 py-3 outline outline-1 outline-[var(--line)]"
        />
        <select name="type" defaultValue={sp.type ?? "all"} className="rounded-2xl bg-[var(--paper)] px-4 py-3">
          <option value="all">All types</option>
          {Object.entries(TYPE_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <select name="region" defaultValue={sp.region ?? ""} className="rounded-2xl bg-[var(--paper)] px-4 py-3">
          <option value="">All regions</option>
          {regions.map((r) => (
            <option key={r.id} value={r.slug}>
              {r.name}
            </option>
          ))}
        </select>
        <select name="badge" defaultValue={sp.badge ?? ""} className="rounded-2xl bg-[var(--paper)] px-4 py-3">
          <option value="">Any badge</option>
          <option value="unesco">UNESCO</option>
          <option value="gi">GI frame</option>
        </select>
        <button className="btn rounded-full bg-[var(--indigo)] px-4 py-2 text-[var(--paper)] md:col-span-4 md:w-fit">
          Apply
        </button>
      </form>
      <p className="mt-6 text-sm text-[var(--ink-soft)]">{items.length} published cards</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            region={regions.find((r) => r.slug === item.region_slug)}
          />
        ))}
      </div>
      <div className="mt-12">
        <h2 className="serif text-3xl">Regions</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {regions.map((r) => (
            <Link
              key={r.id}
              href={`/regions/${r.slug}`}
              className="rounded-full bg-[var(--paper-2)] px-3 py-1 text-sm outline outline-1 outline-[var(--line)]"
            >
              {r.name}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
