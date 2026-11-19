import { getOfficialHelpForHub } from "@/lib/official-help";

export function OfficialHelpPanel({ stateSlug }: { stateSlug: string }) {
  const { national, state, stateNote } = getOfficialHelpForHub(stateSlug);

  return (
    <section aria-labelledby="official-help" className="page-panel p-5 sm:p-6">
      <h2 id="official-help" className="serif text-2xl">
        Official help
      </h2>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">
        Tickets, hours, guides, and safety belong to official portals. We link only , we never
        scrape or impersonate. Checked dates are recorded per link.
      </p>

      <h3 className="mt-6 text-sm font-semibold tracking-wide text-[var(--muted)] uppercase">
        National
      </h3>
      <ul className="mt-3 space-y-3">
        {national.map((link) => (
          <li key={link.id}>
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[var(--primary)] underline underline-offset-2"
            >
              {link.label}
            </a>
            <p className="mt-0.5 text-sm text-[var(--ink-soft)]">{link.purpose}</p>
            <p className="text-xs text-[var(--muted)]">
              {link.publisher} · checked {link.checked_on}
            </p>
          </li>
        ))}
      </ul>

      <h3 className="mt-8 text-sm font-semibold tracking-wide text-[var(--muted)] uppercase">
        This state / UT
      </h3>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">{stateNote}</p>
      {state.length > 0 ? (
        <ul className="mt-3 space-y-3">
          {state.map((link) => (
            <li key={link.id}>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[var(--primary)] underline underline-offset-2"
              >
                {link.label}
              </a>
              {link.status === "needs_verification" ? (
                <span className="ml-2 rounded-full border border-[var(--line-strong)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">
                  Needs verification
                </span>
              ) : null}
              <p className="mt-0.5 text-sm text-[var(--ink-soft)]">{link.purpose}</p>
              <p className="text-xs text-[var(--muted)]">
                {link.publisher} · checked {link.checked_on}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
