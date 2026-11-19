import Link from "next/link";
import { CoverageMeter } from "@/components/CoverageMeter";
import { PageShell } from "@/components/PageShell";
import { getDestinations } from "@/lib/destinations";
import { getCatalogueCoverage, INDIA_STATES } from "@/lib/india-states";

export const metadata = {
  title: "Places · Parampara Path",
  description:
    "Place hubs across India: unlockable cited treasures, visit etiquette, and official help links.",
};

export default function PlacesIndexPage() {
  const coverage = getCatalogueCoverage();
  const cities = getDestinations().filter((d) => d.kind === "city");
  const covered = coverage.coveredSlugs;

  return (
    <PageShell
      width="wide"
      crumbs={[{ href: "/", label: "Home" }, { label: "Places" }]}
      eyebrow="Place hubs"
      title="Pick a place"
      lead="Open a state hub for treasure chests and official help. Empty states stay empty until cited cards are published."
      nextHref="/map"
      nextLabel="Open India map"
      secondaryHref="/places/rajasthan"
      secondaryLabel="Rajasthan hub"
    >
      <div className="max-w-xl">
        <CoverageMeter catalogueCovered={coverage.coveredCount} compact />
      </div>

      <section className="mt-12" aria-labelledby="states-h">
        <h2 id="states-h" className="serif text-3xl">
          States & UTs
        </h2>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {INDIA_STATES.map((s) => {
            const count = coverage.cardCountByState[s.slug] ?? 0;
            const hasCards = covered.has(s.slug);
            return (
              <li key={s.slug}>
                <Link
                  href={`/places/${s.slug}`}
                  className="flex min-h-12 items-center justify-between gap-2 rounded-xl bg-[var(--surface)] px-4 py-3 outline outline-1 outline-[var(--line)] hover:outline-[var(--primary)]"
                >
                  <span className="font-medium">{s.name}</span>
                  <span className="shrink-0 text-xs text-[var(--muted)]">
                    {hasCards ? `${count} treasures` : "Soon"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="cities-h">
        <h2 id="cities-h" className="serif text-2xl">
          Pilot cities
        </h2>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          Deeper heritage-route notes for the Rajasthan pilot. Treasures still come from the state
          catalogue.
        </p>
        <ul className="mt-4 flex flex-wrap gap-3">
          {cities.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/places/${c.slug}`}
                className="btn inline-flex min-h-11 items-center rounded-full border border-[var(--line-strong)] px-5 text-sm"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
