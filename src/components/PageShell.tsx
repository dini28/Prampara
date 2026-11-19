import Link from "next/link";

export type PageCrumb = { href?: string; label: string };

type Props = {
  /** narrow ≈ reading (cards, ask); wide ≈ browse (explore, map, about) */
  width?: "narrow" | "wide";
  /** Short label above the title, where the user is in the product */
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
  const backCrumb = [...(crumbs ?? [])].reverse().find((c) => c.href);

  return (
    <main id="main-content" className={`ios-page mx-auto ${max} px-4 py-5 sm:px-5 sm:py-10`}>
      {before ? <div className="mb-4 sm:mb-6">{before}</div> : null}

      {backCrumb ? (
        <Link
          href={backCrumb.href!}
          className="ios-inline-back mb-3 inline-flex min-h-11 items-center gap-0.5 text-[17px] font-medium text-[var(--primary)] md:hidden"
        >
          <svg
            viewBox="0 0 12 20"
            className="size-[18px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10 2 2 10l8 8" />
          </svg>
          {backCrumb.label}
        </Link>
      ) : null}

      {crumbs && crumbs.length > 0 ? (
        <nav aria-label="Breadcrumb" className="mb-4 hidden md:block">
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

      <header className="page-header border-b border-[var(--line)] pb-5 sm:pb-6">
        {eyebrow ? (
          <p className="text-[13px] font-semibold tracking-[0.02em] text-[var(--primary)] sm:text-sm sm:tracking-wide">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="serif ios-large-title mt-1 text-[34px] leading-[1.05] tracking-[-0.03em] text-[var(--ink)] sm:mt-2 sm:text-5xl">
          {title}
        </h1>
        {lead ? (
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-soft)] sm:mt-3 sm:text-lg">
            {lead}
          </p>
        ) : null}
        {(nextHref && nextLabel) || (secondaryHref && secondaryLabel) ? (
          <div className="mt-4 flex flex-wrap gap-2.5 sm:mt-5 sm:gap-3">
            {nextHref && nextLabel ? (
              <Link
                href={nextHref}
                className="btn ios-primary-btn inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-[var(--primary)] px-5 text-[15px] font-semibold text-[var(--on-primary)] hover:bg-[var(--primary-hover)] sm:flex-none"
              >
                {nextLabel}
              </Link>
            ) : null}
            {secondaryHref && secondaryLabel ? (
              <Link
                href={secondaryHref}
                className="btn ios-secondary-btn inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--line-strong)] px-5 text-[15px] font-medium hover:border-[var(--primary)]"
              >
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        ) : null}
      </header>

      <div className="page-body mt-6 sm:mt-8">{children}</div>
    </main>
  );
}
