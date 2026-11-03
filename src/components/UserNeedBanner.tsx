import Link from "next/link";
import { USER_REQUIREMENTS } from "@/lib/project";

/** Compact strip naming which user requirements the current screen serves. */
export function UserNeedBanner({ ids }: { ids: string[] }) {
  const rows = USER_REQUIREMENTS.filter((ur) => ids.includes(ur.id));
  if (rows.length === 0) return null;

  return (
    <aside
      className="rounded-xl bg-[var(--primary-tint)] px-4 py-3 text-sm outline outline-1 outline-[var(--primary)]/20"
      aria-label="User requirements for this screen"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary-deep)]">
        User need on this screen
      </p>
      <ul className="mt-2 space-y-1.5">
        {rows.map((ur) => (
          <li key={ur.id} className="leading-snug text-[var(--ink)]">
            <span className="font-semibold tabular-nums text-[var(--primary)]">{ur.id}</span>
            <span className="text-[var(--muted)]"> · {ur.user} · </span>
            {ur.need}
          </li>
        ))}
      </ul>
      <Link
        href="/about#requirements"
        className="mt-2 inline-block text-xs text-[var(--primary)] underline underline-offset-4 hover:text-[var(--primary-hover)]"
      >
        Analyse all user requirements
      </Link>
    </aside>
  );
}
