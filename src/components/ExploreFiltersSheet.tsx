"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/BottomSheet";
import { haptic } from "@/lib/haptics";

/** Mobile-only entry that opens filters in a bottom sheet (form still posts to /explore). */
export function ExploreFiltersSheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => {
            haptic(8);
            setOpen(true);
          }}
          className="btn mb-3 flex min-h-12 w-full touch-manipulation select-none items-center justify-center rounded-full border border-[var(--line-strong)] text-sm"
        >
          Filters & search
        </button>
        <BottomSheet open={open} title="Filters" onClose={() => setOpen(false)}>
          {children}
        </BottomSheet>
      </div>
      <div className="hidden md:block">{children}</div>
    </>
  );
}
