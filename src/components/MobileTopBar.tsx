import Link from "next/link";

export function MobileTopBar({ learner }: { learner: string | null }) {
  return (
    <header
      className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--bg-veil)] backdrop-blur-md md:hidden"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex min-h-12 items-center justify-between gap-3 px-4 py-2">
        <Link
          href="/"
          className="flex min-h-11 min-w-0 items-center gap-2 touch-manipulation select-none"
        >
          <span className="serif block truncate text-lg leading-none text-[var(--ink)]">
            Parampara Path
          </span>
          <span className="unofficial-chip shrink-0">Unofficial</span>
        </Link>
        <Link
          href="/me"
          className="btn inline-flex min-h-11 max-w-[40%] shrink-0 touch-manipulation select-none items-center truncate rounded-full border border-[var(--line-strong)] px-3 text-xs text-[var(--ink)] [-webkit-tap-highlight-color:transparent]"
        >
          {learner ?? "Profile"}
        </Link>
      </div>
    </header>
  );
}
