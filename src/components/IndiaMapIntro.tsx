"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "pp_map_intro_seen";
const STEP_MS = 55;
const HOLD_MS = 700;
const FADE_MS = 500;

type Phase = "loading" | "animating" | "done";

function pathCenter(path: SVGPathElement): { x: number; y: number } {
  try {
    const b = path.getBBox();
    if (b.width || b.height) {
      return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
    }
  } catch {
    /* getBBox can throw before layout */
  }
  const d = path.getAttribute("d") || "";
  const m = /M\s*([\d.]+)\s*([\d.]+)/i.exec(d);
  if (m) return { x: Number(m[1]), y: Number(m[2]) };
  return { x: 0, y: 0 };
}

export function IndiaMapIntro({ onComplete }: { onComplete: () => void }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [label, setLabel] = useState("Mapping living heritage…");
  const finishRef = useRef(onComplete);
  finishRef.current = onComplete;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      finishRef.current();
      return;
    }

    let cancelled = false;
    const timers: number[] = [];

    const finish = (persist: boolean) => {
      if (cancelled) return;
      if (persist) sessionStorage.setItem(STORAGE_KEY, "1");
      setPhase("done");
      window.setTimeout(() => finishRef.current(), FADE_MS);
    };

    const run = async () => {
      try {
        const res = await fetch("/india-states.svg", { cache: "force-cache" });
        if (!res.ok) {
          finish(false);
          return;
        }
        const raw = await res.text();
        if (cancelled || !hostRef.current) return;

        hostRef.current.innerHTML = raw;
        const svg = hostRef.current.querySelector("svg");
        if (!svg) {
          finish(false);
          return;
        }

        svg.removeAttribute("width");
        svg.removeAttribute("height");
        if (!svg.getAttribute("viewBox") && svg.getAttribute("viewbox")) {
          svg.setAttribute("viewBox", svg.getAttribute("viewbox")!);
        }
        svg.setAttribute("role", "img");
        svg.setAttribute(
          "aria-label",
          "Outline map of India with states and union territories",
        );
        svg.classList.add("india-map-svg");

        const seen = new Set<string>();
        const paths = Array.from(
          svg.querySelectorAll<SVGPathElement>("path[id^='IN']"),
        ).filter((p) => {
          const id = p.id;
          if (!id || seen.has(id)) return false;
          seen.add(id);
          return true;
        });

        if (paths.length === 0) {
          finish(false);
          return;
        }

        paths.forEach((p) => {
          p.classList.add("india-state");
          p.removeAttribute("fill");
        });

        // Wait a frame so getBBox / paint are valid
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });
        if (cancelled) return;

        setPhase("animating");

        const ordered = [...paths].sort((a, b) => {
          const ca = pathCenter(a);
          const cb = pathCenter(b);
          return ca.x + ca.y * 0.35 - (cb.x + cb.y * 0.35);
        });

        ordered.forEach((path, i) => {
          const t = window.setTimeout(() => {
            if (cancelled) return;
            path.classList.add("india-state--lit");
            const name = path.getAttribute("name");
            if (name) setLabel(name);
            if (i === ordered.length - 1) {
              setLabel("India · living heritage across states & UTs");
              svg.classList.add("india-map-svg--complete");
              const hold = window.setTimeout(() => finish(true), HOLD_MS);
              timers.push(hold);
            }
          }, i * STEP_MS);
          timers.push(t);
        });

        const safety = window.setTimeout(
          () => finish(true),
          ordered.length * STEP_MS + HOLD_MS + 2000,
        );
        timers.push(safety);
      } catch {
        finish(false);
      }
    };

    void run();

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const skip = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setPhase("done");
    window.setTimeout(() => finishRef.current(), 180);
  };

  return (
    <div
      className={`india-intro fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--bg)] px-5 transition-opacity duration-500 ${
        phase === "done" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Introductory map of India"
    >
      <div className="atmosphere absolute inset-0" aria-hidden="true" />
      <p className="relative mb-2 text-xs font-medium tracking-[0.18em] text-[var(--primary)] uppercase">
        Parampara Path
      </p>
      <div
        ref={hostRef}
        className="relative mx-auto w-full max-w-[min(92vw,420px)] md:max-w-[480px]"
        aria-hidden={phase === "loading"}
      />
      <p
        className="relative mt-6 min-h-6 text-center text-sm text-[var(--ink-soft)]"
        aria-live="polite"
      >
        {phase === "loading" ? "Preparing map…" : label}
      </p>
      <button
        type="button"
        onClick={skip}
        className="btn relative mt-8 min-h-11 rounded-full border border-[var(--line-strong)] bg-[var(--bg)] px-5 text-sm text-[var(--ink)] hover:border-[var(--primary)]"
      >
        Skip intro
      </button>
      <p className="relative mt-4 max-w-sm text-center text-[10px] leading-relaxed text-[var(--muted)]">
        Map ©{" "}
        <a
          href="https://simplemaps.com"
          className="underline underline-offset-2 hover:text-[var(--ink)]"
          target="_blank"
          rel="noreferrer"
        >
          Simplemaps.com
        </a>{" "}
        (free commercial use)
      </p>
    </div>
  );
}
