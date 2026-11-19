"use client";

import { useEffect, useState } from "react";
import { getDefaultStateIdentity, getStateIdentity, type StateIdentity } from "@/lib/state-identity";

const MIN_MS = 900;
const MAX_MS = 1500;

type Props = {
  slug: string | null;
  active: boolean;
  onDone: () => void;
};

export function StateTransition({ slug, active, onDone }: Props) {
  const [identity, setIdentity] = useState<StateIdentity>(getDefaultStateIdentity());
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return;
    }
    const id = getStateIdentity(slug);
    setIdentity(id);
    setVisible(true);

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = reduced ? 200 : MIN_MS + Math.random() * (MAX_MS - MIN_MS);
    const t = window.setTimeout(() => {
      setVisible(false);
      onDone();
    }, hold);
    return () => window.clearTimeout(t);
  }, [active, slug, onDone]);

  if (!active && !visible) return null;

  const bg = `oklch(0.22 0.06 ${identity.hue})`;
  const accent = `oklch(0.78 0.08 ${identity.hue})`;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center px-6 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ background: bg, paddingTop: "env(safe-area-inset-top)" }}
      role="status"
      aria-live="polite"
      aria-label={`Entering ${identity.name}`}
    >
      <div className="max-w-sm text-center text-white">
        <p className="text-xs font-medium tracking-[0.2em] uppercase" style={{ color: accent }}>
          {identity.greeting}
        </p>
        <h2 className="serif mt-3 text-4xl">{identity.name}</h2>
        <p className="mt-4 text-sm leading-relaxed text-white/80">{identity.fact}</p>
        <div
          className="mx-auto mt-8 h-1 w-24 overflow-hidden rounded-full bg-white/20"
          aria-hidden="true"
        >
          <div
            className="h-full w-full origin-left animate-[pp-loader_1.2s_ease-in-out]"
            style={{ background: accent }}
          />
        </div>
      </div>
    </div>
  );
}
