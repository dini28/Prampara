import Link from "next/link";
import { headers } from "next/headers";
import { getLearnerName } from "@/lib/learner";
import { DesktopNav } from "@/components/DesktopNav";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { MobileTopBar } from "@/components/MobileTopBar";
import { BrandTag } from "@/components/BrandTag";

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
      <header className="relative z-40 hidden border-b border-[var(--line)] bg-[var(--bg-veil)] backdrop-blur-md md:sticky md:top-0 md:block print:hidden">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3">
          <Link href="/" className="group flex items-center gap-2">
            <span>
              <span className="serif block text-2xl leading-none text-[var(--ink)] group-hover:text-[var(--primary)]">
                Parampara Path
              </span>
              <BrandTag className="mt-1 block text-xs text-[var(--muted)]" />
            </span>
            <BrandTag unofficial className="unofficial-chip" />
          </Link>
          <DesktopNav learner={learner} />
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
        <Link href="/judges#positioning" className="underline underline-offset-2">
          Read positioning
        </Link>
      </div>
      <footer className="hidden border-t border-[var(--line)] bg-[var(--surface)] px-5 py-10 text-sm text-[var(--muted)] md:block">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-3">
            <p className="serif text-lg text-[var(--ink)]">Living Heritage Compass</p>
            <p className="max-w-2xl leading-relaxed">
              Discover India place by place through cited treasures. Ask answers only from the card.
              Contributions need human review.
            </p>
            <p className="text-xs">
              Bookmarks and quiz scores stay on this device unless you export them from Passport.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end md:pt-1">
            <Link
              href="/map"
              className="min-h-10 content-center underline underline-offset-4 hover:text-[var(--ink)]"
            >
              Map
            </Link>
            <Link
              href="/passport"
              className="min-h-10 content-center underline underline-offset-4 hover:text-[var(--ink)]"
            >
              Passport
            </Link>
            <Link
              href="/places/udaipur"
              className="min-h-10 content-center underline underline-offset-4 hover:text-[var(--ink)]"
            >
              Udaipur pilot
            </Link>
            <Link
              href="/judges"
              className="min-h-10 content-center underline underline-offset-4 hover:text-[var(--ink)]"
            >
              For judges
            </Link>
          </div>
        </div>
      </footer>
      <MobileBottomNav />
    </>
  );
}
