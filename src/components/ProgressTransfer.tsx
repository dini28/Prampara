"use client";

import { useState } from "react";
import { PROGRESS_KEY } from "@/lib/learner-progress";

/** Export / import bookmarks and progress stored on this device. */
export function ProgressTransfer() {
  const [msg, setMsg] = useState<string | null>(null);

  function exportData() {
    const payload = {
      version: 2,
      exportedAt: new Date().toISOString(),
      bookmarks: safeParse("pp_bookmarks"),
      progress: safeParse(PROGRESS_KEY),
      itineraries: safeParse("pp_saved_itineraries"),
      itineraryMeta: safeParse("pp_saved_itinerary_meta"),
      photoJournal: safeParse("pp_photo_journal"),
      lang: window.localStorage.getItem("pp_lang"),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "parampara-path-progress.json";
    a.click();
    URL.revokeObjectURL(url);
    setMsg("Exported a JSON file from this device.");
  }

  function importData(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as Record<string, unknown>;
        if (data.bookmarks != null) {
          window.localStorage.setItem("pp_bookmarks", JSON.stringify(data.bookmarks));
        }
        if (data.progress != null) {
          window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(data.progress));
          window.dispatchEvent(new CustomEvent("pp-progress"));
        }
        if (data.itineraries != null) {
          window.localStorage.setItem("pp_saved_itineraries", JSON.stringify(data.itineraries));
        }
        if (data.itineraryMeta != null) {
          window.localStorage.setItem("pp_saved_itinerary_meta", JSON.stringify(data.itineraryMeta));
        }
        if (data.photoJournal != null) {
          window.localStorage.setItem("pp_photo_journal", JSON.stringify(data.photoJournal));
        }
        if (data.lang === "en" || data.lang === "hi") {
          window.localStorage.setItem("pp_lang", data.lang);
        }
        setMsg("Imported onto this device. Lists refresh automatically.");
      } catch {
        setMsg("Could not import that file.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <section className="page-panel mt-8 p-5" aria-labelledby="transfer">
      <h2 id="transfer" className="serif text-xl">
        Export or import progress
      </h2>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">
        Move stamps, unlocked states, bookmarks, and saved itineraries between devices. Server quiz
        scores stay tied to your local name when set.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          className="btn min-h-11 rounded-full bg-[var(--primary)] px-5 text-sm text-[var(--on-primary)]"
          onClick={exportData}
        >
          Export JSON
        </button>
        <label className="btn inline-flex min-h-11 cursor-pointer items-center rounded-full border border-[var(--line-strong)] px-5 text-sm">
          Import JSON
          <input
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(e) => importData(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>
      {msg ? (
        <p className="mt-3 text-sm text-[var(--verified)]" role="status">
          {msg}
        </p>
      ) : null}
    </section>
  );
}

function safeParse(key: string) {
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "null");
  } catch {
    return null;
  }
}
