"use client";

import { useEffect, useState } from "react";
import { IndiaMapIntro } from "@/components/IndiaMapIntro";

export function HomeShell({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const force = params.get("intro") === "1" || params.get("intro") === "force";
    if (force) sessionStorage.removeItem("pp_map_intro_seen");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = !force && sessionStorage.getItem("pp_map_intro_seen") === "1";
    if (reduced || seen) {
      setReady(true);
      return;
    }
    setShowIntro(true);
  }, []);

  return (
    <>
      {showIntro && !ready ? (
        <IndiaMapIntro
          onComplete={() => {
            setReady(true);
            setShowIntro(false);
          }}
        />
      ) : null}
      <div
        className={`transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
        aria-hidden={!ready}
        inert={!ready ? true : undefined}
      >
        {children}
      </div>
    </>
  );
}
