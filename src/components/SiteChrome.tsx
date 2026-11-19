import Link from "next/link";
import { headers } from "next/headers";
import { getLearnerName } from "@/lib/learner";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { MobileTopBar } from "@/components/MobileTopBar";

const desktopLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/map", label: "Map" },
  { href: "/about", label: "Requirements" },
  { href: "/bookmarks", label: "Saved" },
  { href: "/me", label: "Analysis" },
];

async function isDeskRequest() {
  const h = await headers();
  return h.get("x-pp-desk") === "1";
}

export async function SiteHeader() {
  if (await isDeskRequest()) return null;
  const learner = await getLearnerName();
  return (
    <>
      <MobileTopBar learner={learner} />
      <header className="relative z-40 hidden border-b border-[var(--line)] bg-[var(--bg-veil)] backdrop-blur-md md:sticky md:top-0 md:block">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3">
          <Link href="/" className="group">
            <span className="serif block text-2xl leading-none text-[var(--ink)] group-hover:text-[var(--primary)]">
              Parampara Path
            </span>
            <span className="mt-1 block text-xs text-[var(--muted)]">Living Heritage Compass</span>
          </Link>
          <nav
            className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--muted)] sm:gap-x-5"
            aria-label="Primary"
          >
            {desktopLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="min-h-11 content-center hover:text-[var(--ink)]"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="btn min-h-10 content-center rounded-full border border-[var(--line-strong)] bg-[var(--bg)] px-4 py-1 text-[var(--ink)] hover:border-[var(--primary)]"
            >
              {learner ?? "Local name"}
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}

export async function SiteFooter() {
  if (await isDeskRequest()) return null;
  return (
    <>
      <footer className="mt-20 hidden border-t border-[var(--line)] bg-[var(--surface)] px-5 py-10 text-sm text-[var(--muted)] md:block">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-3">
            <p className="serif text-lg text-[var(--ink)]">Unofficial learner tool</p>
            <p className="max-w-2xl leading-relaxed">
              Not affiliated with the Ministry of Culture, UNESCO, AICTE, or Sahapedia. We point to
              official pages; we do not replace the national archive.
            </p>
            <p className="text-xs">
              Local MVP · Cited cards · Grounded Ask with refusal · Human-reviewed contributions
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end md:pt-1">
            <Link
              href="/about#requirements"
              className="min-h-10 content-center underline underline-offset-4 hover:text-[var(--ink)]"
            >
              User requirements
            </Link>
            <Link
              href="/me"
              className="min-h-10 content-center underline underline-offset-4 hover:text-[var(--ink)]"
            >
              Live analysis
            </Link>
            <Link
              href="/explore"
              className="min-h-10 content-center underline underline-offset-4 hover:text-[var(--ink)]"
            >
              Explore
            </Link>
            <Link
              href="/map"
              className="min-h-10 content-center underline underline-offset-4 hover:text-[var(--ink)]"
            >
              Map
            </Link>
          </div>
        </div>
      </footer>
      <MobileBottomNav />
    </>
  );
}
