"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageToggle, useLang } from "@/components/LanguageToggle";
import { haptic } from "@/lib/haptics";
import { t } from "@/lib/i18n";

export function MobileTopBar({ learner }: { learner: string | null }) {
  const pathname = usePathname() || "/";
  const [lang] = useLang();
  const isHome = pathname === "/";
  const initial = (learner?.trim()?.[0] ?? "P").toUpperCase();

  const title = (() => {
    if (pathname === "/") return "Parampara Path";
    if (pathname.startsWith("/places")) return lang === "hi" ? "स्थान" : "Place";
    if (pathname.startsWith("/map")) return t(lang, "navMap");
    if (pathname.startsWith("/passport")) return t(lang, "navPassport");
    if (pathname.startsWith("/judges")) return lang === "hi" ? "न्यायाधीश" : "Judges";
    if (pathname.startsWith("/items")) return lang === "hi" ? "खजाना" : "Treasure";
    return "Parampara Path";
  })();

  return (
    <header
      className="ios-nav-bar sticky top-0 z-40 md:hidden"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="relative flex h-11 items-center justify-between gap-2 px-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {isHome ? (
            <Link
              href="/"
              onClick={() => haptic(6)}
              className="flex min-h-11 min-w-0 items-center gap-2 touch-manipulation select-none [-webkit-tap-highlight-color:transparent]"
            >
              <span className="serif truncate text-[17px] font-semibold leading-none tracking-[-0.02em] text-[var(--ink)]">
                Parampara
              </span>
              <span className="unofficial-chip shrink-0 scale-90">{t(lang, "unofficial")}</span>
            </Link>
          ) : (
            <Link
              href="/"
              onClick={() => haptic(6)}
              className="ios-back inline-flex min-h-11 items-center gap-0.5 touch-manipulation select-none pl-0.5 text-[17px] font-medium text-[var(--primary)] [-webkit-tap-highlight-color:transparent]"
              aria-label={t(lang, "navHome")}
            >
              <svg
                viewBox="0 0 12 20"
                className="size-[18px] shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M10 2 2 10l8 8" />
              </svg>
              <span>{t(lang, "navHome")}</span>
            </Link>
          )}
        </div>

        {!isHome ? (
          <p className="pointer-events-none absolute inset-x-16 truncate text-center text-[17px] font-semibold tracking-[-0.02em] text-[var(--ink)]">
            {title}
          </p>
        ) : null}

        <div className="flex flex-1 items-center justify-end gap-1.5">
          <LanguageToggle className="scale-90" />
          <Link
            href="/passport"
            onClick={() => haptic(6)}
            className="ios-avatar grid size-9 place-items-center touch-manipulation select-none rounded-full text-[13px] font-semibold text-[var(--on-primary)] [-webkit-tap-highlight-color:transparent]"
            aria-label={learner ? `${t(lang, "navPassport")}, ${learner}` : t(lang, "navPassport")}
          >
            {initial}
          </Link>
        </div>
      </div>
    </header>
  );
}
