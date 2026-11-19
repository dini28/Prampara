import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExperienceTabs } from "@/components/ExperienceTabs";
import { HeritageModernToggle } from "@/components/HeritageModernToggle";
import { PageShell } from "@/components/PageShell";
import { PhotoUnderstand } from "@/components/PhotoUnderstand";
import { SaveItineraryButton } from "@/components/SaveItineraryButton";
import { getItemBySlug } from "@/lib/catalogue";
import {
  getBundle,
  getChildCities,
  getDestinationBySlug,
  MODERN_THEME_LABEL,
  PLACE_CATEGORY_LABEL,
  getPartners,
} from "@/lib/destinations";

export async function generateStaticParams() {
  const { getDestinations } = await import("@/lib/destinations");
  return getDestinations().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getDestinationBySlug(slug);
  if (!d) return { title: "Place · Parampara Path" };
  return {
    title: `${d.name} · Parampara Path`,
    description: d.summary,
  };
}

export default async function PlacePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string; city?: string; view?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const bundle = getBundle(slug);
  if (!bundle) notFound();
  const { destination: d, places, experiences, modern_items, itineraries } = bundle;
  const partners = getPartners(slug);
  const parent = d.parent_slug ? getDestinationBySlug(d.parent_slug) : null;
  const children = d.kind === "state" ? getChildCities(d.slug) : [];
  const food = experiences.filter((e) => e.type === "food");
  const travel = experiences.filter((e) => e.type === "travel");
  const routePlaces = [...places].sort((a, b) => (a.route_order ?? 99) - (b.route_order ?? 99));
  const suggestedCity =
    sp.city && d.kind === "state" ? getDestinationBySlug(sp.city) : null;

  const heritageBlock = (
    <div className="space-y-8">
      {d.kind === "state" && d.story_sections ? (
        <section aria-labelledby="state-story">
          <h2 id="state-story" className="serif text-3xl">
            Layer 1 · State story
          </h2>
          <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
            A short overview of the deeper culture of {d.name}: history, communities, crafts, music,
            festivals, food, architecture, and how they connect.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {d.story_sections.map((sec) => (
              <article key={sec.id} className="page-panel p-5">
                <h3 className="serif text-xl">{sec.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{sec.body}</p>
                {sec.related_card_slugs?.length ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {sec.related_card_slugs.map((cs) => {
                      const card = getItemBySlug(cs);
                      return card ? (
                        <li key={cs}>
                          <Link
                            href={`/items/${cs}`}
                            className="text-xs font-medium text-[var(--primary)] underline underline-offset-2"
                          >
                            Card: {card.title}
                          </Link>
                        </li>
                      ) : null;
                    })}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
          {children.length ? (
            <div className="mt-8">
              <h3 className="serif text-2xl">Cities to open next</h3>
              <ul className="mt-4 flex flex-wrap gap-3">
                {children.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/places/${c.slug}`}
                      className="btn inline-flex min-h-11 items-center rounded-full bg-[var(--primary)] px-5 text-sm text-[var(--on-primary)]"
                    >
                      {c.name}
                      {suggestedCity?.slug === c.slug ? " · suggested from location" : ""}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      {d.kind === "city" ? (
        <>
          {parent ? (
            <p className="text-sm text-[var(--ink-soft)]">
              Layer 1 state story:{" "}
              <Link href={`/places/${parent.slug}`} className="text-[var(--primary)] underline">
                {parent.name}
              </Link>
            </p>
          ) : null}

          <section aria-labelledby="city-route">
            <h2 id="city-route" className="serif text-3xl">
              Layer 2 · City heritage route
            </h2>
            <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
              A suggested walk order for {d.name}. Each stop has meaning, what to notice, respectful
              visit notes, and sources with access dates. No invented prices or opening hours.
            </p>
            {routePlaces.length === 0 ? (
              <p className="mt-4 rounded-xl bg-[var(--surface)] p-4 text-sm text-[var(--ink-soft)]">
                Heritage places for this city are ready to load from a data file. Open{" "}
                <Link href="/places/udaipur" className="text-[var(--primary)] underline">
                  Udaipur
                </Link>{" "}
                for the full pilot route.
              </p>
            ) : (
              <ol className="mt-6 space-y-6">
                {routePlaces.map((place) => (
                  <li
                    key={place.id}
                    id={`place-${place.slug}`}
                    className="page-panel scroll-mt-28 p-5"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                      <span className="rounded-full bg-[var(--primary-tint)] px-2.5 py-1 text-[var(--primary-deep)]">
                        Stop {place.route_order ?? "·"}
                      </span>
                      <span className="rounded-full bg-[var(--surface)] px-2.5 py-1 outline outline-1 outline-[var(--line)]">
                        {PLACE_CATEGORY_LABEL[place.category]}
                      </span>
                      {place.lesser_known ? (
                        <span className="rounded-full bg-[var(--verified-tint)] px-2.5 py-1 text-[var(--verified)]">
                          Lesser known
                        </span>
                      ) : null}
                      {place.sensitivity_flag ? (
                        <span className="rounded-full border border-[var(--line-strong)] px-2.5 py-1">
                          Handle with care
                        </span>
                      ) : null}
                    </div>
                    <h3 className="serif mt-3 text-2xl">{place.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed">
                      <strong>What it is:</strong> {place.what_it_is}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                      <strong>Why it matters:</strong> {place.why_it_matters}
                    </p>
                    <div className="mt-3">
                      <p className="text-sm font-medium">What to notice</p>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-[var(--ink-soft)]">
                        {place.what_to_notice.map((n) => (
                          <li key={n}>{n}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed">
                      <strong>How to visit respectfully:</strong> {place.respectful_visit}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm">
                      <a
                        className="text-[var(--primary)] underline"
                        href={`https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lng}#map=16/${place.lat}/${place.lng}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open in maps
                      </a>
                      <span className="text-[var(--muted)]">
                        Pin {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                      </span>
                      <span className="text-[var(--verified)]">
                        Last verified {place.last_verified}
                      </span>
                    </div>
                    <ul className="mt-3 space-y-1 text-xs">
                      {place.sources.map((s) => (
                        <li key={s.id}>
                          <a
                            href={s.url}
                            className="text-[var(--primary)] underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {s.title}
                          </a>
                          {s.publisher ? ` · ${s.publisher}` : ""} · accessed {s.accessed_on}
                        </li>
                      ))}
                    </ul>
                    {place.nearby_lesser_known_slugs?.length ? (
                      <p className="mt-3 text-sm text-[var(--ink-soft)]">
                        Nearby lesser known:{" "}
                        {place.nearby_lesser_known_slugs.map((ns, i) => {
                          const np = routePlaces.find((p) => p.slug === ns);
                          return (
                            <span key={ns}>
                              {i > 0 ? ", " : ""}
                              <a href={`#place-${ns}`} className="text-[var(--primary)] underline">
                                {np?.name ?? ns}
                              </a>
                            </span>
                          );
                        })}
                      </p>
                    ) : null}
                    {place.give_back ? (
                      <div className="mt-4 rounded-xl bg-[var(--saffron-tint)] p-4 text-sm text-[var(--saffron-ink)]">
                        <p className="font-semibold">Give back</p>
                        <ul className="mt-2 list-disc space-y-1 pl-5">
                          {place.give_back.tips.map((t) => (
                            <li key={t}>{t}</li>
                          ))}
                        </ul>
                        {place.give_back.official_support_links?.map((l) => (
                          <a
                            key={l.url}
                            href={l.url}
                            className="mt-2 inline-block underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {l.label}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section className="mt-12" aria-labelledby="layer3">
            <h2 id="layer3" className="serif text-3xl">
              Layer 3 · Experience guide
            </h2>
            <div className="mt-6">
              <ExperienceTabs
                see={
                  <ul className="space-y-3">
                    {routePlaces.slice(0, 6).map((p) => (
                      <li key={p.id} className="page-panel p-4">
                        <a href={`#place-${p.slug}`} className="serif text-lg text-[var(--primary)]">
                          {p.name}
                        </a>
                        <p className="mt-1 text-sm text-[var(--ink-soft)]">{p.what_it_is}</p>
                      </li>
                    ))}
                  </ul>
                }
                travel={
                  <ul className="space-y-4">
                    {travel.map((e) => (
                      <li key={e.id} className="page-panel p-4">
                        <h3 className="serif text-xl">{e.title}</h3>
                        <p className="mt-2 text-sm">{e.story}</p>
                        <p className="mt-2 text-sm text-[var(--ink-soft)]">{e.details}</p>
                        <p className="mt-2 text-xs text-[var(--verified)]">
                          Last verified {e.last_verified}
                        </p>
                        <ul className="mt-2 space-y-1 text-xs">
                          {e.sources.map((s) => (
                            <li key={s.id}>
                              <a href={s.url} className="text-[var(--primary)] underline" target="_blank" rel="noreferrer">
                                {s.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                    {!travel.length ? (
                      <p className="text-sm text-[var(--muted)]">Travel notes coming in this city file.</p>
                    ) : null}
                  </ul>
                }
                food={
                  <ul className="space-y-4">
                    {food.map((e) => (
                      <li key={e.id} className="page-panel p-4">
                        <h3 className="serif text-xl">{e.title}</h3>
                        <p className="mt-2 text-sm">{e.story}</p>
                        <p className="mt-2 text-sm text-[var(--ink-soft)]">{e.details}</p>
                        {e.dietary_labels?.length ? (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {e.dietary_labels.map((dlab) => (
                              <span
                                key={dlab}
                                className="rounded-full bg-[var(--verified-tint)] px-2.5 py-0.5 text-xs text-[var(--verified)]"
                              >
                                {dlab.replace(/_/g, " ")}
                              </span>
                            ))}
                          </div>
                        ) : null}
                        <p className="mt-2 text-xs text-[var(--verified)]">
                          Last verified {e.last_verified}
                        </p>
                      </li>
                    ))}
                    {!food.length ? (
                      <p className="text-sm text-[var(--muted)]">Food notes coming in this city file.</p>
                    ) : null}
                  </ul>
                }
              />
            </div>
          </section>

          {partners.length ? (
            <section className="mt-12" aria-labelledby="local-first">
              <h2 id="local-first" className="serif text-3xl">
                Fair and local first
              </h2>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">
                Ranked only by heritage significance, authenticity, community benefit, visitor
                friendliness, and season fit. Never by payment. Sponsored content: none in this MVP.
              </p>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {partners.map((p) => (
                  <li key={p.id} className="page-panel p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--terracotta)]">
                      {p.kind.replace(/_/g, " ")}
                    </p>
                    <h3 className="serif mt-1 text-lg">{p.name}</h3>
                    <p className="mt-2 text-sm text-[var(--ink-soft)]">{p.tip}</p>
                    <p className="mt-2 text-xs text-[var(--verified)]">Verified {p.last_verified}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {itineraries.length ? (
            <section className="mt-12" aria-labelledby="itineraries">
              <h2 id="itineraries" className="serif text-3xl">
                End of journey · Saveable itineraries
              </h2>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {itineraries.map((it) => (
                  <article key={it.id} className="page-panel p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="serif text-2xl">{it.title}</h3>
                        <p className="mt-2 text-sm text-[var(--ink-soft)]">{it.summary}</p>
                      </div>
                      <SaveItineraryButton itinerarySlug={it.slug} title={it.title} />
                    </div>
                    <ol className="mt-4 space-y-2 text-sm">
                      {it.stops.map((s) => (
                        <li key={s.order} className="flex gap-2">
                          <span className="font-semibold text-[var(--primary)]">{s.order}.</span>
                          <span>
                            <span className="font-medium">{s.title}</span>
                            <span className="text-[var(--muted)]"> · {s.kind}</span>
                            <br />
                            <span className="text-[var(--ink-soft)]">{s.note}</span>
                          </span>
                        </li>
                      ))}
                    </ol>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </>
      ) : null}
    </div>
  );

  const modernBlock = (
    <div>
      <h2 className="serif text-3xl">Layer 4 · Modern India</h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--ink-soft)]">
        Contemporary life in the same place: studios, cafes, startups, music, sustainability, and
        craft revival. Each item links back to related heritage.
      </p>
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {modern_items.map((m) => (
          <li key={m.id} className="page-panel p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--terracotta)]">
              {MODERN_THEME_LABEL[m.theme]}
            </p>
            <h3 className="serif mt-1 text-xl">{m.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{m.summary}</p>
            <p className="mt-2 text-xs text-[var(--verified)]">Last verified {m.last_verified}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {m.related_place_slugs?.map((ps) => (
                <a key={ps} href={`#place-${ps}`} className="text-[var(--primary)] underline">
                  Heritage: {ps.replace(/-/g, " ")}
                </a>
              ))}
              {m.related_card_slugs?.map((cs) => (
                <Link key={cs} href={`/items/${cs}`} className="text-[var(--primary)] underline">
                  Card: {cs}
                </Link>
              ))}
            </div>
            <ul className="mt-2 space-y-1 text-xs">
              {m.sources.map((s) => (
                <li key={s.id}>
                  <a href={s.url} className="underline" target="_blank" rel="noreferrer">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
        {!modern_items.length ? (
          <li className="text-sm text-[var(--muted)]">
            Modern items will appear when this city data file is filled. See Udaipur for the pilot.
          </li>
        ) : null}
      </ul>
    </div>
  );

  return (
    <PageShell
      width="wide"
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/places", label: "Places" },
        ...(parent ? [{ href: `/places/${parent.slug}`, label: parent.name }] : []),
        { label: d.name },
      ]}
      eyebrow={d.kind === "state" ? "State story" : "City guide"}
      title={d.name}
      lead={d.summary}
      nextHref={d.kind === "state" ? `/places/${children[0]?.slug ?? "udaipur"}` : "/items/kalbelia"}
      nextLabel={
        d.kind === "state"
          ? `Next: ${children[0]?.name ?? "Udaipur"} city`
          : "Next: Read a cited card"
      }
      secondaryHref="/places"
      secondaryLabel="All places"
    >
      {sp.from === "location" ? (
        <p className="mb-6 rounded-xl bg-[var(--verified-tint)] px-4 py-3 text-sm text-[var(--verified)]">
          Approximate location matched nearby. Showing the state story first
          {suggestedCity ? `, then continue to ${suggestedCity.name}` : ""}.
        </p>
      ) : null}

      <div className="relative mb-8 overflow-hidden rounded-2xl outline outline-1 outline-[var(--line)]">
        <div className="relative aspect-[21/9] min-h-48">
          <Image
            src={d.hero_image.src}
            alt={d.hero_image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <p className="bg-[var(--surface)] px-4 py-2 text-xs text-[var(--muted)]">
          {d.hero_image.credit}
        </p>
      </div>

      <HeritageModernToggle heritage={heritageBlock} modern={modernBlock} />

      <div className="mt-12">
        <PhotoUnderstand destinationSlug={d.slug} />
      </div>

      <p className="mt-8 text-center text-xs text-[var(--muted)]">
        <Link href="/about#report" className="underline">
          Report a problem
        </Link>
        {" · "}
        Ranking is never payment based.
      </p>
    </PageShell>
  );
}
