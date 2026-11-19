"use client";

import { useState } from "react";

export function ExperienceTabs({
  see,
  travel,
  food,
}: {
  see: React.ReactNode;
  travel: React.ReactNode;
  food: React.ReactNode;
}) {
  const [tab, setTab] = useState<"see" | "travel" | "food">("see");
  const tabs = [
    { id: "see" as const, label: "Best places to see" },
    { id: "travel" as const, label: "Best travel" },
    { id: "food" as const, label: "Best food" },
  ];
  return (
    <div>
      <div
        className="flex flex-wrap gap-2 border-b border-[var(--line)] pb-3"
        role="tablist"
        aria-label="Experience guide"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`min-h-11 rounded-full px-4 text-sm font-medium ${
              tab === t.id
                ? "bg-[var(--saffron-tint)] text-[var(--saffron-ink)] outline outline-1 outline-[var(--saffron)]"
                : "text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-6" role="tabpanel">
        {tab === "see" ? see : tab === "travel" ? travel : food}
      </div>
    </div>
  );
}
