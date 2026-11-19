import Link from "next/link";
import { TYPE_LABEL } from "@/lib/catalogue";
import type { HeritageItem, Region } from "@/lib/types";

const TYPE_PLACEHOLDER: Record<string, { bg: string; mark: string }> = {
  festival: { bg: "oklch(0.72 0.12 70)", mark: "Fest" },
  craft: { bg: "oklch(0.55 0.1 40)", mark: "Craft" },
  performing: { bg: "oklch(0.45 0.1 275)", mark: "Perf" },
  oral: { bg: "oklch(0.5 0.08 155)", mark: "Oral" },
  ritual: { bg: "oklch(0.48 0.1 20)", mark: "Rite" },
  knowledge: { bg: "oklch(0.42 0.08 250)", mark: "Know" },
};

export function ItemCard({
  item,
  region,
}: {
  item: HeritageItem;
  region?: Region;
}) {
  const sourceCount = item.sources.length;
  const ph = TYPE_PLACEHOLDER[item.type] ?? TYPE_PLACEHOLDER.craft;
  return (
    <Link
      href={`/items/${item.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-[var(--bg)] shadow-[var(--shadow)] outline outline-1 outline-[var(--line)] transition-[outline-color] duration-200 hover:outline-[var(--primary)]"
    >
      <div
        className="relative flex h-28 items-end p-4 text-white"
        style={{ background: ph.bg }}
        aria-hidden="true"
      >
        <span className="serif text-3xl opacity-30">{ph.mark}</span>
        <span className="absolute right-3 top-3 rounded-full bg-black/20 px-2 py-0.5 text-[10px] uppercase tracking-wide">
          {TYPE_LABEL[item.type]}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
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
              UNESCO ICH
            </span>
          ) : null}
          {item.gi_flag ? (
            <span className="rounded-full bg-[var(--surface)] px-2.5 py-0.5 text-[var(--ink)] outline outline-1 outline-[var(--line)]">
              GI tag
            </span>
          ) : null}
          <span className="ml-auto inline-flex items-center gap-1 text-[var(--verified)]">
            <svg
              viewBox="0 0 16 16"
              className="size-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {sourceCount} {sourceCount === 1 ? "source" : "sources"}
          </span>
        </div>
      </div>
      <span className="sr-only">
        Illustrated placeholder for {TYPE_LABEL[item.type]} card {item.title}
      </span>
    </Link>
  );
}
