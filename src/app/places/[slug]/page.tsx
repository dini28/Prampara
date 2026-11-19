import Link from "next/link";
import { notFound } from "next/navigation";
import { OfficialHelpPanel } from "@/components/OfficialHelpPanel";
import { PageShell } from "@/components/PageShell";
import { PhotoUnderstand } from "@/components/PhotoUnderstand";
import { TreasureChests } from "@/components/TreasureChests";
import { getBundle, getChildCities } from "@/lib/destinations";
import { getAllPlaceHubSlugs, resolvePlaceHub } from "@/lib/place-hub";

export async function generateStaticParams() {
  return getAllPlaceHubSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hub = resolvePlaceHub(slug);
  if (!hub) return { title: "Place · Parampara Path" };
  return {
    title: `${hub.name} · Parampara Path`,
    description: hub.blurb,
  };
}

export default async function PlaceHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hub = resolvePlaceHub(slug);
  if (!hub) notFound();

  const bundle = hub.destination ? getBundle(hub.destination.slug) : null;
  const routePlaces = bundle
    ? [...bundle.places].sort((a, b) => (a.route_order ?? 99) - (b.route_order ?? 99))
    : [];
  const cities =
    hub.kind === "state"
      ? hub.childCities.length
        ? hub.childCities
        : getChildCities(hub.stateSlug)
      : [];

  const chests = hub.treasures.map((t) => ({
    slug: t.slug,
    title: t.title,
    type: t.type,
    summary: t.summary,
    sensitivity: t.sensitivity_flag,
  }));

  return (
    <PageShell
      width="wide"
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/map", label: "Map" },
        ...(hub.parent
          ? [{ href: `/places/${hub.parent.slug}`, label: hub.parent.name }]
          : hub.kind === "city"
            ? [{ href: `/places/${hub.stateSlug}`, label: hub.stateName }]
            : []),
        { label: hub.name },
      ]}
      eyebrow={hub.kind === "city" ? "City place hub" : "State place hub"}
      title={hub.name}
      lead={hub.blurb}
      nextHref={
        hub.treasures[0]
          ? `/items/${hub.treasures[0].slug}`
          : "/map"
      }
      nextLabel={hub.treasures[0] ? "Open first treasure" : "Back to map"}
      secondaryHref="/map"
      secondaryLabel="India map"
    >
      <section aria-labelledby="chests-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="chests-heading" className="serif text-3xl">
              Treasures
            </h2>
            <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
              Cited cards for {hub.stateName}. Preview any chest; opening it stamps your passport.
              Sacred or restricted practices are taught carefully , never as capture targets.
            </p>
          </div>
          <p className="text-sm tabular-nums text-[var(--muted)]">
            {hub.treasures.length} published
          </p>
        </div>
        <div className="mt-6">
          <TreasureChests stateSlug={hub.stateSlug} treasures={chests} />
        </div>
      </section>

      <section className="mt-12" aria-labelledby="look-at-place">
        <h2 id="look-at-place" className="sr-only">
          Camera look at this place
        </h2>
        <PhotoUnderstand destinationSlug={hub.slug} compact />
      </section>

      <section className="mt-12" aria-labelledby="etiquette-heading">
        <h2 id="etiquette-heading" className="serif text-2xl">
          Visit responsibly
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--ink-soft)]">
          {hub.etiquette}
        </p>
      </section>

      <div className="mt-12">
        <OfficialHelpPanel stateSlug={hub.stateSlug} />
      </div>

      {cities.length > 0 ? (
        <section className="mt-12" aria-labelledby="cities-heading">
          <h2 id="cities-heading" className="serif text-2xl">
            Cities in this pilot
          </h2>
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
      ) : null}

      {hub.kind === "city" && routePlaces.length > 0 ? (
        <section className="mt-12 border-t border-[var(--line)] pt-12" aria-labelledby="route-heading">
          <h2 id="route-heading" className="serif text-2xl">
            Heritage route (pilot)
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--ink-soft)]">
            Optional deeper stops for {hub.name}. Each includes respectful visit notes and sources.
            Prefer official portals above for tickets and hours.
          </p>
          <ol className="mt-6 space-y-4">
            {routePlaces.map((place) => (
              <li key={place.id} className="page-panel p-4">
                <div className="flex flex-wrap gap-2 text-xs font-medium">
                  <span className="rounded-full bg-[var(--primary-tint)] px-2.5 py-1 text-[var(--primary-deep)]">
                    Stop {place.route_order ?? "·"}
                  </span>
                  {place.sensitivity_flag ? (
                    <span className="rounded-full border border-[var(--line-strong)] px-2.5 py-1">
                      Handle with care
                    </span>
                  ) : null}
                </div>
                <h3 className="serif mt-2 text-xl">{place.name}</h3>
                <p className="mt-2 text-sm text-[var(--ink-soft)]">{place.what_it_is}</p>
                <p className="mt-2 text-sm">
                  <strong>Respectfully:</strong> {place.respectful_visit}
                </p>
                <p className="mt-2 text-xs text-[var(--verified)]">
                  Last verified {place.last_verified}
                </p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {hub.destination?.story_sections?.length ? (
        <section className="mt-12 border-t border-[var(--line)] pt-12" aria-labelledby="story-heading">
          <h2 id="story-heading" className="serif text-2xl">
            State story (pilot)
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {hub.destination.story_sections.map((sec) => (
              <article key={sec.id} className="page-panel p-5">
                <h3 className="serif text-xl">{sec.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{sec.body}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}
