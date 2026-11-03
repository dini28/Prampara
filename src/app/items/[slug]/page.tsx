import { BookmarkButton } from "@/components/BookmarkButton";
import { LoopStepper } from "@/components/LoopStepper";
import { SourceList } from "@/components/SourceList";
import { UserNeedBanner } from "@/components/UserNeedBanner";
import { getItemBySlug, getRegionBySlug, TYPE_LABEL } from "@/lib/catalogue";
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
  const lastChecked = item.sources
    .map((s) => s.accessed_on)
    .sort()
    .at(-1);

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <LoopStepper current="card" itemSlug={item.slug} />
      <div className="mt-6">
        <UserNeedBanner ids={["UR-03", "UR-08", "UR-12"]} />
      </div>
      <p className="mt-8 flex flex-wrap items-center gap-2 text-sm text-[var(--ink-soft)]">
        <span className="font-medium text-[var(--ink)]">{TYPE_LABEL[item.type]}</span>
        <span aria-hidden="true">·</span>
        <Link
          href={`/regions/${item.region_slug}`}
          className="underline underline-offset-4 hover:text-[var(--ink)]"
        >
          {region?.name}
        </Link>
      </p>
      <h1 className="serif mt-3 text-5xl leading-[1.05]">{item.title}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium">
        {item.unesco_id ? (
          <span className="rounded-full bg-[var(--primary-tint)] px-3 py-1 text-[var(--primary-deep)]">
            UNESCO listed
          </span>
        ) : null}
        {item.gi_flag ? (
          <span className="rounded-full bg-[var(--surface)] px-3 py-1 outline outline-1 outline-[var(--line)]">
            GI tag
          </span>
        ) : null}
        {item.sensitivity_flag ? (
          <span className="rounded-full border border-[var(--line-strong)] px-3 py-1">Handle with care</span>
        ) : null}
        <a
          href="#sources"
          className="inline-flex items-center gap-1 rounded-full bg-[var(--verified-tint)] px-3 py-1 text-[var(--verified)] hover:underline"
        >
          <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {item.sources.length} sources{lastChecked ? ` · checked ${lastChecked}` : ""}
        </a>
      </div>
      <p className="mt-5 text-sm leading-relaxed text-[var(--ink-soft)]">
        Step 2 of the loop: read the attributed card, then continue to Ask (ground or refuse), Quiz,
        or Contribute (pending until review).
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <BookmarkButton slug={item.slug} />
        <Link
          href={`/items/${item.slug}/ask`}
          className="btn inline-flex min-h-11 items-center rounded-full bg-[var(--primary)] px-5 text-sm text-[var(--on-primary)] hover:bg-[var(--primary-hover)]"
        >
          Ask from this card
        </Link>
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
      <article className="space-y-4 whitespace-pre-wrap text-[17px] leading-[1.7]">
        {item.body}
      </article>
      <section className="mt-10 rounded-2xl bg-[var(--surface)] p-5 outline outline-1 outline-[var(--line)]">
        <h2 className="serif text-2xl">Calendar note</h2>
        <p className="mt-2 text-sm leading-relaxed">{item.calendar_note}</p>
      </section>
      <section id="sources" className="mt-10 scroll-mt-24">
        <h2 className="serif text-2xl">Sources</h2>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          Trust is inspectable: open each citation. Ask will only answer from this card and these
          sources.
        </p>
        <SourceList sources={item.sources} />
      </section>
      <nav
        className="mt-12 flex flex-wrap gap-3 border-t border-[var(--line)] pt-8"
        aria-label="Continue learner loop"
      >
        <Link
          href={`/items/${item.slug}/ask`}
          className="btn inline-flex min-h-11 items-center rounded-full bg-[var(--primary)] px-5 text-sm text-[var(--on-primary)] hover:bg-[var(--primary-hover)]"
        >
          Next: Ask
        </Link>
        <Link
          href="/explore"
          className="btn inline-flex min-h-11 items-center rounded-full border border-[var(--line-strong)] px-5 text-sm hover:border-[var(--primary)]"
        >
          Back to Explore
        </Link>
      </nav>
    </main>
  );
}
