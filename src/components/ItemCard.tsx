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
  const sourceCount = item.sources.length;
  return (
    <Link
      href={`/items/${item.slug}`}
      className="group flex flex-col rounded-2xl bg-[var(--bg)] p-5 shadow-[var(--shadow)] outline outline-1 outline-[var(--line)] transition-[outline-color] duration-200 hover:outline-[var(--primary)]"
    >
      <div className="flex items-center justify-between gap-3 text-xs text-[var(--ink-soft)]">
        <span className="font-medium text-[var(--ink)]">{TYPE_LABEL[item.type]}</span>
        <span>{region?.name ?? item.region_slug}</span>
      </div>
      <h3 className="serif mt-3 text-2xl leading-tight text-[var(--ink)] group-hover:text-[var(--primary)]">
        {item.title}
      </h3>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--ink-soft)]">
        {item.summary}
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4 text-[11px] font-medium">
        {item.unesco_id ? (
          <span className="rounded-full bg-[var(--primary-tint)] px-2.5 py-0.5 text-[var(--primary-deep)]">
            UNESCO listed
          </span>
        ) : null}
        {item.gi_flag ? (
          <span className="rounded-full bg-[var(--surface)] px-2.5 py-0.5 text-[var(--ink)] outline outline-1 outline-[var(--line)]">
            GI tag
          </span>
        ) : null}
        <span className="ml-auto inline-flex items-center gap-1 text-[var(--verified)]">
          <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {sourceCount} {sourceCount === 1 ? "source" : "sources"}
        </span>
      </div>
    </Link>
  );
}
