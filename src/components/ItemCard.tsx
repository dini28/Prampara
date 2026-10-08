import Link from "next/link";
import { TYPE_LABEL } from "@/lib/catalogue";
import type { HeritageItem, Region } from "@/lib/types";

export function ItemCard({
  item,
  region,
}: {
  item: HeritageItem;
  region?: Region;
}) {
  return (
    <Link
      href={`/items/${item.slug}`}
      className="group block rounded-[28px] bg-[var(--paper-2)] p-5 shadow-[var(--shadow)] outline outline-1 outline-[var(--line)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.18em] text-[var(--terracotta)]">
        <span>{TYPE_LABEL[item.type]}</span>
        <span className="text-[var(--ink-soft)]">{region?.name ?? item.region_slug}</span>
      </div>
      <h3 className="serif mt-3 text-2xl leading-tight text-[var(--ink)] group-hover:text-[var(--indigo)]">
        {item.title}
      </h3>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--ink-soft)]">
        {item.summary}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {item.unesco_id ? (
          <span className="rounded-full bg-[var(--indigo)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--paper)]">
            UNESCO
          </span>
        ) : null}
        {item.gi_flag ? (
          <span className="rounded-full bg-[var(--gold)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--ink)]">
            GI frame
          </span>
        ) : null}
      </div>
    </Link>
  );
}
