"use client";

import { useId, useState } from "react";

/** Accessible plain-language tooltip for jargon (ICH, GI, Grounded Ask). */
export function InfoTip({ label, children }: { label: string; children: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex items-center gap-1">
      <span>{label}</span>
      <button
        type="button"
        className="inline-flex size-6 items-center justify-center rounded-full bg-[var(--primary-tint)] text-xs font-bold text-[var(--primary)]"
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        aria-label={`About ${label}`}
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
      >
        ?
      </button>
      {open ? (
        <span
          id={id}
          role="tooltip"
          className="absolute left-0 top-full z-20 mt-2 w-64 rounded-xl bg-[var(--ink)] p-3 text-left text-xs leading-relaxed text-[var(--on-primary)] shadow-[var(--shadow)]"
        >
          {children}
        </span>
      ) : null}
    </span>
  );
}
