"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/i18n";

const KEY = "pp_lang";

export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const stored = window.localStorage.getItem(KEY);
    if (stored === "hi" || stored === "en") setLangState(stored);
  }, []);
  function setLang(l: Lang) {
    setLangState(l);
    window.localStorage.setItem(KEY, l);
    document.documentElement.lang = l === "hi" ? "hi" : "en";
    window.dispatchEvent(new CustomEvent("pp-lang", { detail: l }));
  }
  return [lang, setLang];
}

export function LanguageToggle({ className = "" }: { className?: string }) {
  const [lang, setLang] = useLang();
  return (
    <div
      className={`inline-flex rounded-full outline outline-1 outline-[var(--line)] ${className}`}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        className={`min-h-10 min-w-11 rounded-full px-3 text-xs font-medium ${
          lang === "en"
            ? "bg-[var(--primary)] text-[var(--on-primary)]"
            : "text-[var(--muted)] hover:text-[var(--ink)]"
        }`}
        aria-pressed={lang === "en"}
        onClick={() => setLang("en")}
      >
        EN
      </button>
      <button
        type="button"
        className={`min-h-10 min-w-11 rounded-full px-3 text-xs font-medium ${
          lang === "hi"
            ? "bg-[var(--primary)] text-[var(--on-primary)]"
            : "text-[var(--muted)] hover:text-[var(--ink)]"
        }`}
        aria-pressed={lang === "hi"}
        onClick={() => setLang("hi")}
      >
        हिं
      </button>
    </div>
  );
}
