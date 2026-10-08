import Link from "next/link";
import { ItemCard } from "@/components/ItemCard";
import { getDisclaimer, getItemBySlug, getRegionBySlug } from "@/lib/catalogue";

export default function HomePage() {
  const kalbelia = getItemBySlug("kalbelia");
  const durga = getItemBySlug("durga-puja-kolkata");
  const thathera = getItemBySlug("thathera-jandiala-guru");
  const featured = [kalbelia, durga, thathera].filter(Boolean);

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <p className="max-w-3xl rounded-2xl bg-[var(--indigo)] px-4 py-3 text-sm text-[var(--paper)]">
        {getDisclaimer()}
      </p>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="text-[12px] uppercase tracking-[0.24em] text-[var(--terracotta)]">
            AICTE student innovation · Heritage & Culture
          </p>
          <h1 className="serif mt-4 max-w-[14ch] text-6xl leading-[0.92] text-[var(--ink)] md:text-7xl">
            A compass, not an archive.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--ink-soft)]">
            Place or theme → verified card → grounded Q&A → quiz → optional story that stays hidden
            until a human accepts it. AI is a retrieval interface, not an author of culture.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/items/kalbelia"
              className="btn rounded-full bg-[var(--terracotta)] px-6 py-3 text-[var(--paper)]"
            >
              Demo: Jaipur → Kalbelia
            </Link>
            <Link
              href="/explore"
              className="btn rounded-full border border-[var(--line)] px-6 py-3"
            >
              Explore 40 cards
            </Link>
          </div>
        </div>
        <aside className="rounded-[32px] bg-[var(--paper-2)] p-6 outline outline-1 outline-[var(--line)]">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold)]">North-star</p>
          <p className="serif mt-2 text-3xl">Under eight minutes. No hallucinated fact.</p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--ink-soft)]">
            <li>Attribution before animation</li>
            <li>Place and practice are first-class</li>
            <li>Unpublished until reviewed</li>
            <li>Depth over coverage</li>
          </ul>
        </aside>
      </div>
      <section className="mt-16 grid gap-5 md:grid-cols-3">
        {featured.map((item) =>
          item ? (
            <ItemCard key={item.id} item={item} region={getRegionBySlug(item.region_slug)} />
          ) : null,
        )}
      </section>
    </main>
  );
}
