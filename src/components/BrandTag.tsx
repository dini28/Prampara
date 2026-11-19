"use client";

import { useLang } from "@/components/LanguageToggle";
import { t } from "@/lib/i18n";

export function BrandTag({
  className = "",
  unofficial = false,
}: {
  className?: string;
  unofficial?: boolean;
}) {
  const [lang] = useLang();
  if (unofficial) {
    return (
      <span className={className} title="Unofficial learner tool">
        {t(lang, "unofficial")}
      </span>
    );
  }
  return <span className={className}>{t(lang, "brandTag")}</span>;
}
