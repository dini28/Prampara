import Link from "next/link";
import { getLearnerName } from "@/lib/learner";

const links = [
  { href: "/explore", label: "Explore" },
  { href: "/bookmarks", label: "Bookmarks" },
  { href: "/me", label: "Path" },
  { href: "/admin", label: "Admin" },
];

export async function SiteHeader() {
  const learner = await getLearnerName();
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[oklch(1_0_0_/_0.86)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-baseline justify-between gap-6 px-5 py-4">
        <Link href="/" className="group">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--primary)]">
            Living Heritage Compass
          </p>
          <p className="serif text-2xl leading-none text-[var(--ink)] group-hover:text-[var(--primary-deep)]">
            Parampara Path
          </p>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--muted)]">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="min-h-10 content-center hover:text-[var(--ink)]">
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="btn min-h-10 content-center rounded-full border border-[var(--line)] bg-[var(--bg)] px-3 py-1 text-[var(--primary-deep)]"
          >
            {learner ?? "Local name"}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[var(--line)] px-5 py-10 text-sm text-[var(--muted)]">
      <div className="mx-auto max-w-6xl space-y-3">
        <p className="serif text-lg text-[var(--ink)]">Unofficial learner tool</p>
        <p>
          Not affiliated with the Ministry of Culture, UNESCO, AICTE, or Sahapedia. We point to
          official pages; we do not replace the national archive.
        </p>
        <p className="text-xs uppercase tracking-[0.16em]">
          Local MVP · Supabase later · Attribution before animation
        </p>
      </div>
    </footer>
  );
}
