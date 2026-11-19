import Link from "next/link";
import { headers } from "next/headers";
import { getLearnerName } from "@/lib/learner";
import { LanguageToggle } from "@/components/LanguageToggle";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { MobileTopBar } from "@/components/MobileTopBar";

const desktopLinks = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/places", label: "Places" },
  { href: "/map", label: "Map" },
  { href: "/bookmarks", label: "Saved" },
  { href: "/me", label: "Profile" },
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
          <Link href="/" className="group flex items-center gap-2">
            <span>
              <span className="serif block text-2xl leading-none text-[var(--ink)] group-hover:text-[var(--primary)]">
                Parampara Path
              </span>
              <span className="mt-1 block text-xs text-[var(--muted)]">Living Heritage Compass</span>
            </span>
            <span className="unofficial-chip" title="Unofficial learner tool">
              Unofficial
            </span>
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
            <LanguageToggle />
            <Link
              href="/me"
              className="btn min-h-10 content-center rounded-full border border-[var(--line-strong)] bg-[var(--bg)] px-4 py-1 text-[var(--ink)] hover:border-[var(--primary)]"
            >
              {learner ?? "Profile"}
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
      <div className="border-t border-[var(--line)] bg-[var(--saffron-tint)] px-5 py-2 text-center text-xs text-[var(--saffron-ink)]">
        Unofficial learner tool. Not affiliated with the Ministry of Culture, UNESCO, AICTE, or
        Sahapedia.{" "}
        <Link href="/about#positioning" className="underline underline-offset-2">
          Read positioning
        </Link>
      </div>
      <footer className="hidden border-t border-[var(--line)] bg-[var(--surface)] px-5 py-10 text-sm text-[var(--muted)] md:block">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-3">
            <p className="serif text-lg text-[var(--ink)]">Place first culture guide</p>
            <p className="max-w-2xl leading-relaxed">
              Visit any place in India and understand it deeply through cited state stories, city
              routes, food, travel, and modern India. Cards stay grounded: Ask refuses invention, and
              contributions need human review.
            </p>
            <p className="text-xs">
              Bookmarks and quiz scores stay on this device unless you export them from Profile.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end md:pt-1">
            <Link
              href="/about"
              className="min-h-10 content-center underline underline-offset-4 hover:text-[var(--ink)]"
            >
              About
            </Link>
            <Link
              href="/about#for-jury"
              className="min-h-10 content-center underline underline-offset-4 hover:text-[var(--ink)]"
            >
              For jury
            </Link>
            <Link
              href="/places/udaipur"
              className="min-h-10 content-center underline underline-offset-4 hover:text-[var(--ink)]"
            >
              Udaipur pilot
            </Link>
            <Link
              href="/map"
              className="min-h-10 content-center underline underline-offset-4 hover:text-[var(--ink)]"
            >
              Map
            </Link>
            <Link
              href="/explore"
              className="min-h-10 content-center underline underline-offset-4 hover:text-[var(--ink)]"
            >
              Explore cards
            </Link>
          </div>
        </div>
      </footer>
      <MobileBottomNav />
    </>
  );
}
