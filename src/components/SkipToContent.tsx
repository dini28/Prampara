"use client";

import { useLang } from "@/components/LanguageToggle";
import { t } from "@/lib/i18n";

export function SkipToContent() {
  const [lang] = useLang();
  return (
    <a
      href="#main-content"
      className="fixed left-4 top-4 z-[100] -translate-y-16 rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--on-primary)] opacity-0 shadow-lg outline outline-2 outline-offset-2 outline-[var(--saffron)] transition-transform focus:translate-y-0 focus:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
    >
      {t(lang, "skipToContent")}
    </a>
  );
}
