"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/components/LanguageToggle";
import { haptic } from "@/lib/haptics";
import { t, type UiKey } from "@/lib/i18n";

const tabs = [
  { href: "/", labelKey: "navHome" as const, match: (p: string) => p === "/" },
  {
    href: "/map",
    labelKey: "navMap" as const,
    match: (p: string) =>
      p.startsWith("/map") ||
      p.startsWith("/places") ||
      p.startsWith("/items") ||
      p.startsWith("/regions"),
  },
  {
    href: "/passport",
    labelKey: "navPassport" as const,
    match: (p: string) =>
      p.startsWith("/passport") ||
      p.startsWith("/bookmarks") ||
      p.startsWith("/me") ||
      p.startsWith("/login"),
  },
] as const;

function Icon({
  name,
  active,
}: {
  name: UiKey;
  active: boolean;
}) {
  const stroke = active ? "var(--primary)" : "var(--muted)";
  const fill = active ? "var(--primary)" : "none";
  const common = {
    viewBox: "0 0 24 24",
    className: `size-[26px] transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.2,0,0,1)] ${
      active ? "scale-100" : "scale-[0.96] opacity-90"
    }`,
    fill,
    stroke,
    strokeWidth: active ? 0 : 1.7,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "navHome":
      return (
        <svg {...common} strokeWidth={active ? 0 : 1.7} fill={active ? "var(--primary)" : "none"}>
          <path
            d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
            strokeLinejoin="round"
            stroke={active ? "none" : stroke}
          />
        </svg>
      );
    case "navMap":
      return (
        <svg {...common}>
          <path
            d="M9 4 3 6.5V19l6-2.5L15 19l6-2.5V4.5L15 7 9 4Z"
            strokeLinejoin="round"
            fill={active ? "var(--primary)" : "none"}
            stroke={active ? "none" : stroke}
          />
        </svg>
      );
    case "navPassport":
      return (
        <svg {...common}>
          <path
            d="M7 4h10a1 1 0 0 1 1 1v15l-6-3.5L6 20V5a1 1 0 0 1 1-1Z"
            strokeLinejoin="round"
            fill={active ? "var(--primary)" : "none"}
            stroke={active ? "none" : stroke}
          />
        </svg>
      );
    default:
      return null;
  }
}

export function MobileBottomNav() {
  const pathname = usePathname() || "/";
  const [lang] = useLang();

  return (
    <nav
      className="ios-tab-bar fixed inset-x-0 bottom-0 z-50 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary mobile"
    >
      <ul className="mx-auto flex h-[49px] max-w-lg items-stretch justify-between px-1">
        {tabs.map((tab) => {
          const active = tab.match(pathname);
          const label = t(lang, tab.labelKey);
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                onClick={() => haptic(8)}
                className={`ios-tab-item flex h-full touch-manipulation select-none flex-col items-center justify-center gap-0.5 px-1 [-webkit-tap-highlight-color:transparent] ${
                  active ? "text-[var(--primary)]" : "text-[var(--muted)]"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <span className="relative grid place-items-center">
                  <Icon name={tab.labelKey} active={active} />
                </span>
                <span
                  className={`text-[10px] leading-none tracking-[-0.01em] ${
                    active ? "font-semibold" : "font-medium"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
