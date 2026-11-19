"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { haptic } from "@/lib/haptics";

const tabs = [
  { href: "/", label: "Home", match: (p: string) => p === "/" },
  {
    href: "/explore",
    label: "Explore",
    match: (p: string) =>
      p.startsWith("/explore") ||
      p.startsWith("/regions") ||
      p.startsWith("/items") ||
      p.startsWith("/places"),
  },
  { href: "/map", label: "Map", match: (p: string) => p.startsWith("/map") },
  { href: "/bookmarks", label: "Saved", match: (p: string) => p.startsWith("/bookmarks") },
  { href: "/me", label: "Profile", match: (p: string) => p.startsWith("/me") || p.startsWith("/login") },
] as const;

function Icon({ name, active }: { name: (typeof tabs)[number]["label"]; active: boolean }) {
  const stroke = active ? "var(--primary)" : "var(--muted)";
  const common = {
    viewBox: "0 0 24 24",
    className: "size-6",
    fill: "none",
    stroke,
    strokeWidth: 1.75,
    "aria-hidden": true as const,
  };
  switch (name) {
    case "Home":
      return (
        <svg {...common}>
          <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" strokeLinejoin="round" />
        </svg>
      );
    case "Explore":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
      );
    case "Map":
      return (
        <svg {...common}>
          <path d="M9 4 3 6.5V19l6-2.5L15 19l6-2.5V4.5L15 7 9 4Z" strokeLinejoin="round" />
          <path d="M9 4v12.5M15 7v12" strokeLinecap="round" />
        </svg>
      );
    case "Saved":
      return (
        <svg {...common}>
          <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-3.5L6 20V5a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
        </svg>
      );
    case "Profile":
      return (
        <svg {...common}>
          <circle cx="12" cy="9" r="3.5" />
          <path d="M5.5 19.5c1.5-3 4-4.5 6.5-4.5s5 1.5 6.5 4.5" strokeLinecap="round" />
        </svg>
      );
  }
}

export function MobileBottomNav() {
  const pathname = usePathname() || "/";
  // Hide on staff desk (rewritten URLs still show as obscure path , detect /staff never reaches client)
  // Also hide when path looks like desk (no public links anyway)

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--line)] bg-[var(--bg-veil)] backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary mobile"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-1">
        {tabs.map((tab) => {
          const active = tab.match(pathname);
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                onClick={() => haptic(8)}
                className={`flex min-h-14 touch-manipulation select-none flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-medium [-webkit-tap-highlight-color:transparent] ${
                  active ? "text-[var(--primary)]" : "text-[var(--muted)]"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon name={tab.label} active={active} />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
