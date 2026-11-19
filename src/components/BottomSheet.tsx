"use client";

import { useEffect, useRef } from "react";
import { haptic } from "@/lib/haptics";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function BottomSheet({ open, title, onClose, children }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] md:hidden" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-[oklch(0.15_0.02_255/0.45)]"
        aria-label="Close sheet"
        onClick={() => {
          haptic(8);
          onClose();
        }}
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto overscroll-contain rounded-t-3xl bg-[var(--bg)] px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-3 shadow-[var(--shadow)]"
        style={{ touchAction: "pan-y" }}
        onTouchStart={(e) => {
          startY.current = e.touches[0]?.clientY ?? 0;
        }}
        onTouchEnd={(e) => {
          const y = e.changedTouches[0]?.clientY ?? 0;
          if (y - startY.current > 80) {
            haptic(8);
            onClose();
          }
        }}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--line-strong)]" aria-hidden="true" />
        <h2 className="serif text-2xl">{title}</h2>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
