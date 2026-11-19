import { BookmarkButton } from "@/components/BookmarkButton";
import { InfoTip } from "@/components/InfoTip";
import { LoopStepper } from "@/components/LoopStepper";
import { PageShell } from "@/components/PageShell";
import { SourceList } from "@/components/SourceList";
import { VisitTreasure } from "@/components/VisitTreasure";
import { getItemBySlug, getRegionBySlug, TYPE_LABEL } from "@/lib/catalogue";
import { enrichPlace } from "@/lib/place-enrichment";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getItemBySlug(slug);
  if (!item) notFound();
  const region = getRegionBySlug(item.region_slug);
  const place = enrichPlace(item, region);
  const lastChecked = item.sources
    .map((s) => s.accessed_on)
    .sort()
    .at(-1);

  return (
    <PageShell
      width="narrow"
      before={
        <div className="sticky-mini-header -mx-5 px-5 py-3 md:static md:mx-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
          <LoopStepper current="card" itemSlug={item.slug} />
        </div>
      }
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/map", label: "Map" },
        ...(region
          ? [{ href: `/map?region=${item.region_slug}`, label: region.name }]
          : []),
        { label: item.title },
      ]}
      eyebrow={`Treasure · ${TYPE_LABEL[item.type]}`}
      title={item.title}
      lead="What it is, who keeps it alive, and how to engage respectfully, with sources you can open."
      nextHref={`/items/${item.slug}/ask`}
      nextLabel="Next: Ask a question"
      secondaryHref="/map"
      secondaryLabel="Back to map"
    >
      <VisitTreasure itemSlug={item.slug} regionSlug={item.region_slug} />
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
        {item.unesco_id ? (
          <span className="rounded-full bg-[var(--primary-tint)] px-3 py-1.5 text-[var(--primary-deep)]">
            <InfoTip label="UNESCO ICH">
              UNESCO Intangible Cultural Heritage: living practice on a UNESCO list.
            </InfoTip>
          </span>
        ) : null}
        {item.gi_flag ? (
          <span className="rounded-full bg-[var(--surface)] px-3 py-1.5 outline outline-1 outline-[var(--line)]">
            <InfoTip label="GI tag">
              Geographical Indication (protected craft name) under Indian IP law.
            </InfoTip>
          </span>
        ) : null}
        {item.sensitivity_flag ? (
          <span className="rounded-full border border-[var(--line-strong)] px-3 py-1.5">
            Handle with care
          </span>
        ) : null}
        {place.lesserKnown ? (
          <span className="rounded-full bg-[var(--verified-tint)] px-3 py-1.5 text-[var(--verified)]">
            Lesser-known
          </span>
        ) : null}
        <a
          href="#sources"
          className="inline-flex min-h-11 items-center gap-1 rounded-full bg-[var(--verified-tint)] px-3 text-[var(--verified)] hover:underline"
        >
          {item.sources.length} sources
          {lastChecked ? ` · checked ${lastChecked}` : ""}
        </a>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <BookmarkButton slug={item.slug} />
        <Link
          href={region ? `/places/${item.region_slug === "rajasthan" ? "udaipur" : item.region_slug}` : "/places"}
          className="btn inline-flex min-h-11 items-center rounded-full border border-[var(--line-strong)] px-5 text-sm hover:border-[var(--primary)]"
        >
          Place guide
        </Link>
      </div>

      <aside className="page-panel mt-8 p-5" aria-label="Key facts">
        <h2 className="serif text-xl">Key facts</h2>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          {place.keyFacts.map((f) => (
            <div key={f.label}>
              <dt className="text-xs font-medium text-[var(--muted)]">{f.label}</dt>
              <dd className="mt-0.5 text-sm text-[var(--ink)]">{f.value}</dd>
            </div>
          ))}
        </dl>
      </aside>

      <p className="mt-8 text-lg leading-relaxed text-[var(--ink-soft)]">{item.summary}</p>
      <hr className="my-8 border-[var(--line)]" />
      <article className="space-y-4 whitespace-pre-wrap text-[17px] leading-[1.7] text-[var(--ink)]">
        {item.body}
      </article>

      <section className="mt-10 grid gap-4" aria-label="Learner sections">
        <div className="page-panel p-5">
          <h2 className="serif text-xl">What it is</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{place.story}</p>
        </div>
        <div className="page-panel p-5">
          <h2 className="serif text-xl">Who keeps it alive</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{place.whoKeepsAlive}</p>
        </div>
        <div className="page-panel p-5">
          <h2 className="serif text-xl">How to engage respectfully</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{place.howToEngage}</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{place.respectfulTips}</p>
        </div>
        <div className="page-panel p-5">
          <h2 className="serif text-xl">Traditions and season</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{place.traditions}</p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
            <strong>Best season / calendar note:</strong> {place.bestSeason}
          </p>
        </div>
        <div className="page-panel p-5">
          <h2 className="serif text-xl">How to reach</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{place.howToReach}</p>
          {place.mapUrl && place.lat != null && place.lng != null ? (
            <div className="mt-4 overflow-hidden rounded-xl outline outline-1 outline-[var(--line)]">
              <iframe
                title={`Map of ${place.placeName}`}
                className="h-48 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${place.lng - 0.35}%2C${place.lat - 0.25}%2C${place.lng + 0.35}%2C${place.lat + 0.25}&layer=mapnik&marker=${place.lat}%2C${place.lng}`}
              />
              <a
                href={place.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="block bg-[var(--surface)] px-4 py-3 text-sm text-[var(--primary)] underline"
              >
                Open in maps · {place.placeName}
              </a>
            </div>
          ) : null}
        </div>
      </section>

      <section id="sources" className="mt-10 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="serif text-2xl">Sources</h2>
          <Link href="/judges#report" className="text-sm text-[var(--primary)] underline">
            Report a problem
          </Link>
        </div>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          Trust is inspectable: open each citation. Ask answers only from this card and these sources.
        </p>
        <SourceList sources={item.sources} />
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href={`/items/${item.slug}/ask`}
          className="btn inline-flex min-h-12 items-center rounded-full bg-[var(--primary)] px-6 text-[var(--on-primary)]"
        >
          Next: Ask a question
        </Link>
        <BookmarkButton slug={item.slug} />
      </div>
    </PageShell>
  );
}
