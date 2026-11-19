"use client";

import Link from "next/link";
import { LanguageToggle, useLang } from "@/components/LanguageToggle";
import { t } from "@/lib/i18n";

export function DesktopNav({ learner }: { learner: string | null }) {
  const [lang] = useLang();
  const links = [
    { href: "/", label: t(lang, "navHome") },
    { href: "/map", label: t(lang, "navMap") },
    { href: "/passport", label: t(lang, "navPassport") },
  ];

  return (
    <nav
      className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--muted)] sm:gap-x-5"
      aria-label="Primary"
    >
      {links.map((l) => (
        <Link key={l.href} href={l.href} className="min-h-11 content-center hover:text-[var(--ink)]">
          {l.label}
        </Link>
      ))}
      <LanguageToggle />
      <Link
        href="/passport"
        className="btn min-h-10 content-center rounded-full border border-[var(--line-strong)] bg-[var(--bg)] px-4 py-1 text-[var(--ink)] hover:border-[var(--primary)]"
      >
        {learner ?? t(lang, "navPassport")}
      </Link>
    </nav>
  );
}
