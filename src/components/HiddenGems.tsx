import Link from "next/link";
import { TYPE_LABEL } from "@/lib/catalogue-labels";
import type { HiddenGem } from "@/lib/hidden-gems";

export function HiddenGems({ gems }: { gems: HiddenGem[] }) {
  if (gems.length === 0) return null;

  const lead = gems[0];
  const rest = gems.slice(1);

  return (
    <section aria-labelledby="hidden-gems">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="max-w-2xl">
          <h2 id="hidden-gems" className="serif text-3xl sm:text-4xl">
            Hidden gems of the states
          </h2>
          <p className="mt-3 text-[var(--ink-soft)] leading-relaxed">
            Living practices that carry India&apos;s true cultural identity: crafts, rituals, and
            performance that itineraries often skip. Each gem is a cited card, not a brochure myth.
          </p>
        </div>
        <Link
          href="/map"
          className="text-sm font-medium text-[var(--primary)] underline-offset-4 hover:underline"
        >
          Browse all states
        </Link>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        <Link
          href={`/items/${lead.slug}`}
          className="group relative overflow-hidden rounded-2xl bg-[var(--surface)] outline outline-1 outline-[var(--line)] shadow-[var(--shadow)] transition-[outline-color] duration-200 hover:outline-[var(--primary)]"
        >
          <div className="absolute inset-0 jali-accent opacity-40" aria-hidden="true" />
          <div className="relative flex min-h-[280px] flex-col justify-between p-6 sm:p-8">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-[var(--primary)] uppercase">
                {lead.greeting} · {lead.stateName}
              </p>
              <h3 className="serif mt-3 text-3xl leading-tight text-[var(--ink)] group-hover:text-[var(--primary)] sm:text-4xl">
                {lead.title}
              </h3>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--ink-soft)] sm:text-base">
                {lead.whyHidden}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] font-medium">
              <span className="rounded-full bg-[var(--primary-tint)] px-2.5 py-0.5 text-[var(--primary-deep)]">
                {TYPE_LABEL[lead.type]}
              </span>
              {lead.unesco ? (
                <span className="rounded-full bg-[var(--saffron-tint)] px-2.5 py-0.5 text-[var(--saffron-ink)]">
                  UNESCO ICH
                </span>
              ) : null}
              {lead.gi ? (
                <span className="rounded-full bg-[var(--bg)] px-2.5 py-0.5 outline outline-1 outline-[var(--line)]">
                  GI tag
                </span>
              ) : null}
              <span className="ml-auto text-[var(--primary)] underline-offset-4 group-hover:underline">
                Open gem
              </span>
            </div>
          </div>
        </Link>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {rest.slice(0, 6).map((gem) => (
            <li key={gem.slug}>
              <Link
                href={`/items/${gem.slug}`}
                className="flex h-full flex-col rounded-2xl bg-[var(--bg)] p-4 outline outline-1 outline-[var(--line)] transition-[outline-color] duration-200 hover:outline-[var(--primary)] sm:p-5"
              >
                <p className="text-[11px] font-semibold tracking-[0.12em] text-[var(--muted)] uppercase">
                  {gem.stateName}
                </p>
                <h3 className="serif mt-1.5 text-lg leading-snug text-[var(--ink)]">{gem.title}</h3>
                <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-[var(--ink-soft)]">
                  {gem.whyHidden}
                </p>
                <span className="mt-3 text-[11px] font-medium text-[var(--primary)]">
                  {TYPE_LABEL[gem.type]}
                  {gem.unesco ? " · UNESCO" : gem.gi ? " · GI" : ""}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {rest.length > 6 ? (
        <ul className="mt-4 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {rest.slice(6).map((gem) => (
            <li key={gem.slug} className="min-w-[220px] shrink-0">
              <Link
                href={`/items/${gem.slug}`}
                className="block rounded-2xl bg-[var(--surface)] p-4 outline outline-1 outline-[var(--line)] hover:outline-[var(--primary)]"
              >
                <p className="text-[11px] font-semibold text-[var(--muted)] uppercase">
                  {gem.stateName}
                </p>
                <p className="serif mt-1 text-base leading-snug">{gem.title}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
