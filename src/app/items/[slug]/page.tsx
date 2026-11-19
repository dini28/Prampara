import { BookmarkButton } from "@/components/BookmarkButton";
import { LoopStepper } from "@/components/LoopStepper";
import { PageShell } from "@/components/PageShell";
import { SourceList } from "@/components/SourceList";
import { UserNeedBanner } from "@/components/UserNeedBanner";
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
        <>
          <LoopStepper current="card" itemSlug={item.slug} />
          <div className="mt-4">
            <UserNeedBanner ids={["UR-03", "UR-08", "UR-12"]} />
          </div>
        </>
      }
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/explore", label: "Explore" },
        ...(region
          ? [{ href: `/regions/${item.region_slug}`, label: region.name }]
          : []),
        { label: item.title },
      ]}
      eyebrow={`Step 2 · ${TYPE_LABEL[item.type]} card`}
      title={item.title}
      lead="Read the attributed card, then continue to Ask (ground or refuse), Quiz, or Contribute (pending until review)."
      nextHref={`/items/${item.slug}/ask`}
      nextLabel="Next: Ask"
      secondaryHref="/explore"
      secondaryLabel="Back to Explore"
    >
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
        {item.unesco_id ? (
          <span className="rounded-full bg-[var(--primary-tint)] px-3 py-1.5 text-[var(--primary-deep)]">
            UNESCO listed
          </span>
        ) : null}
        {item.gi_flag ? (
          <span className="rounded-full bg-[var(--surface)] px-3 py-1.5 outline outline-1 outline-[var(--line)]">
            GI tag
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
          href={`/items/${item.slug}/quiz`}
          className="btn inline-flex min-h-11 items-center rounded-full border border-[var(--line-strong)] px-5 text-sm hover:border-[var(--primary)]"
        >
          Quiz
        </Link>
        <Link
          href={`/items/${item.slug}/contribute`}
          className="btn inline-flex min-h-11 items-center rounded-full border border-[var(--line-strong)] px-5 text-sm hover:border-[var(--primary)]"
        >
          Contribute
        </Link>
      </div>

      <p className="mt-8 text-lg leading-relaxed text-[var(--ink-soft)]">{item.summary}</p>
      <hr className="my-8 border-[var(--line)]" />
      <article className="space-y-4 whitespace-pre-wrap text-[17px] leading-[1.7] text-[var(--ink)]">
        {item.body}
      </article>

      <section className="mt-10 grid gap-4 sm:grid-cols-2" aria-label="Traveller notes">
        <div className="page-panel p-5">
          <h2 className="serif text-xl">Story / mythology</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{place.story}</p>
        </div>
        <div className="page-panel p-5">
          <h2 className="serif text-xl">Traditions</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{place.traditions}</p>
        </div>
        <div className="page-panel p-5">
          <h2 className="serif text-xl">Best season</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{place.bestSeason}</p>
        </div>
        <div className="page-panel p-5">
          <h2 className="serif text-xl">How to reach</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{place.howToReach}</p>
        </div>
        <div className="page-panel p-5 sm:col-span-2">
          <h2 className="serif text-xl">Respectful visit</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{place.respectfulTips}</p>
        </div>
      </section>

      <section className="page-panel mt-10 p-5">
        <h2 className="serif text-2xl">Calendar note</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{item.calendar_note}</p>
      </section>

      <section id="sources" className="mt-10 scroll-mt-24">
        <h2 className="serif text-2xl">Sources</h2>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          Trust is inspectable: open each citation. Ask answers only from this card and these sources.
        </p>
        <SourceList sources={item.sources} />
      </section>
    </PageShell>
  );
}
