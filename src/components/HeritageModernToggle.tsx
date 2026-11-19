"use client";

import { useState } from "react";

export function HeritageModernToggle({
  heritage,
  modern,
}: {
  heritage: React.ReactNode;
  modern: React.ReactNode;
}) {
  const [mode, setMode] = useState<"heritage" | "modern">("heritage");
  return (
    <div>
      <div
        className="inline-flex rounded-full bg-[var(--surface)] p-1 outline outline-1 outline-[var(--line)]"
        role="tablist"
        aria-label="Heritage or Modern India"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "heritage"}
          className={`min-h-11 rounded-full px-4 text-sm font-medium ${
            mode === "heritage"
              ? "bg-[var(--primary)] text-[var(--on-primary)]"
              : "text-[var(--muted)]"
          }`}
          onClick={() => setMode("heritage")}
        >
          Heritage
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "modern"}
          className={`min-h-11 rounded-full px-4 text-sm font-medium ${
            mode === "modern"
              ? "bg-[var(--terracotta)] text-white"
              : "text-[var(--muted)]"
          }`}
          onClick={() => setMode("modern")}
        >
          Modern
        </button>
      </div>
      <div className="mt-6" role="tabpanel">
        {mode === "heritage" ? heritage : modern}
      </div>
    </div>
  );
}
