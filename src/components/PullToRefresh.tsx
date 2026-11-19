"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { haptic } from "@/lib/haptics";

/** Lightweight pull-to-refresh for mobile lists (Explore, Saved). */
export function PullToRefresh({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const startY = useRef(0);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  return (
    <div
      className="relative overscroll-contain md:overscroll-auto"
      style={{ touchAction: "pan-y" }}
      onTouchStart={(e) => {
        if (window.scrollY > 0) return;
        startY.current = e.touches[0]?.clientY ?? 0;
      }}
      onTouchMove={(e) => {
        if (window.scrollY > 0 || refreshing) return;
        const y = e.touches[0]?.clientY ?? 0;
        const d = Math.max(0, Math.min(72, y - startY.current));
        setPull(d);
      }}
      onTouchEnd={() => {
        if (pull > 56) {
          setRefreshing(true);
          haptic(12);
          router.refresh();
          window.setTimeout(() => {
            setRefreshing(false);
            setPull(0);
          }, 600);
        } else {
          setPull(0);
        }
      }}
    >
      <div
        className="pointer-events-none flex justify-center text-xs text-[var(--muted)] transition-[height] md:hidden"
        style={{ height: pull || (refreshing ? 36 : 0) }}
        aria-hidden={!refreshing && pull === 0}
      >
        <span className="pt-2">{refreshing ? "Refreshing…" : pull > 56 ? "Release" : "Pull to refresh"}</span>
      </div>
      {children}
    </div>
  );
}
