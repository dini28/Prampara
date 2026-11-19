import Link from "next/link";

export type PageCrumb = { href?: string; label: string };

type Props = {
  /** narrow ≈ reading (cards, ask); wide ≈ browse (explore, map, about) */
  width?: "narrow" | "wide";
  /** Short label above the title , where the user is in the product */
  eyebrow?: string;
  title: string;
  /** One sentence: what this page is for */
  lead?: string;
  crumbs?: PageCrumb[];
  /** Optional primary next action under the lead */
  nextHref?: string;
  nextLabel?: string;
  /** Secondary link */
  secondaryHref?: string;
  secondaryLabel?: string;
  /** Content above the title (e.g. loop stepper) */
  before?: React.ReactNode;
  children: React.ReactNode;
};

export function PageShell({
  width = "wide",
  eyebrow,
  title,
  lead,
  crumbs,
  nextHref,
  nextLabel,
  secondaryHref,
  secondaryLabel,
  before,
  children,
}: Props) {
  const max = width === "narrow" ? "max-w-3xl" : "max-w-6xl";

  return (
    <main className={`mx-auto ${max} px-5 py-8 sm:py-10`}>
      {before ? <div className="mb-6">{before}</div> : null}

      {crumbs && crumbs.length > 0 ? (
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-[var(--muted)]">
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1;
              return (
                <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
                  {i > 0 ? (
                    <span aria-hidden="true" className="text-[var(--line-strong)]">
                      /
                    </span>
                  ) : null}
                  {c.href && !last ? (
                    <Link
                      href={c.href}
                      className="min-h-11 content-center underline-offset-4 hover:text-[var(--ink)] hover:underline"
                    >
                      {c.label}
                    </Link>
                  ) : (
                    <span
                      className={last ? "font-medium text-[var(--ink)]" : undefined}
                      aria-current={last ? "page" : undefined}
                    >
                      {c.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      ) : null}

      <header className="page-header border-b border-[var(--line)] pb-6">
        {eyebrow ? (
          <p className="text-sm font-medium tracking-wide text-[var(--primary)]">{eyebrow}</p>
        ) : null}
        <h1 className="serif mt-2 text-4xl leading-[1.08] text-[var(--ink)] sm:text-5xl">{title}</h1>
        {lead ? (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg">
            {lead}
          </p>
        ) : null}
        {(nextHref && nextLabel) || (secondaryHref && secondaryLabel) ? (
          <div className="mt-5 flex flex-wrap gap-3">
            {nextHref && nextLabel ? (
              <Link
                href={nextHref}
                className="btn inline-flex min-h-12 items-center rounded-full bg-[var(--primary)] px-5 text-sm text-[var(--on-primary)] hover:bg-[var(--primary-hover)]"
              >
                {nextLabel}
              </Link>
            ) : null}
            {secondaryHref && secondaryLabel ? (
              <Link
                href={secondaryHref}
                className="btn inline-flex min-h-12 items-center rounded-full border border-[var(--line-strong)] px-5 text-sm hover:border-[var(--primary)]"
              >
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        ) : null}
      </header>

      <div className="page-body mt-8">{children}</div>
    </main>
  );
}
