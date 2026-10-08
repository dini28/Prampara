import { BookmarkButton } from "@/components/BookmarkButton";
import { SourceList } from "@/components/SourceList";
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

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--terracotta)]">
        {TYPE_LABEL[item.type]} ·{" "}
        <Link href={`/regions/${item.region_slug}`} className="underline">
          {region?.name}
        </Link>
      </p>
      <h1 className="serif mt-3 text-5xl leading-[1.05]">{item.title}</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {item.unesco_id ? (
          <span className="rounded-full bg-[var(--indigo)] px-3 py-1 text-xs text-[var(--paper)]">UNESCO</span>
        ) : null}
        {item.gi_flag ? (
          <span className="rounded-full bg-[var(--gold)] px-3 py-1 text-xs">GI frame</span>
        ) : null}
        {item.sensitivity_flag ? (
          <span className="rounded-full border border-[var(--line)] px-3 py-1 text-xs">Handle with care</span>
        ) : null}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <BookmarkButton slug={item.slug} />
        <Link href={`/items/${item.slug}/ask`} className="btn rounded-full bg-[var(--indigo)] px-4 py-1.5 text-sm text-[var(--paper)]">
          Ask
        </Link>
        <Link href={`/items/${item.slug}/quiz`} className="btn rounded-full bg-[var(--terracotta)] px-4 py-1.5 text-sm text-[var(--paper)]">
          Quiz
        </Link>
        <Link href={`/items/${item.slug}/contribute`} className="btn rounded-full border border-[var(--line)] px-4 py-1.5 text-sm">
          Contribute
        </Link>
      </div>
      <p className="mt-8 text-lg leading-relaxed text-[var(--ink-soft)]">{item.summary}</p>
      <article className="mt-8 space-y-4 whitespace-pre-wrap text-[17px] leading-[1.7]">
        {item.body}
      </article>
      <section className="mt-10 rounded-[28px] bg-[var(--paper-2)] p-5">
        <h2 className="serif text-2xl">Calendar note</h2>
        <p className="mt-2 text-sm leading-relaxed">{item.calendar_note}</p>
      </section>
      <section className="mt-10">
        <h2 className="serif text-2xl">Sources</h2>
        <SourceList sources={item.sources} />
      </section>
    </main>
  );
}
