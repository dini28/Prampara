"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { getDestinations } from "@/lib/destinations-client";

type Props = {
  compact?: boolean;
};

export function WhereAreYou({ compact = false }: Props) {
  const router = useRouter();
  const destinations = useMemo(() => getDestinations(), []);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  const matches = destinations.filter((d) => {
    const hay = `${d.name} ${d.state_ut} ${d.slug}`.toLowerCase();
    return !q.trim() || hay.includes(q.trim().toLowerCase());
  });

  async function useLocation() {
    if (!navigator.geolocation) {
      setStatus("Location is not available on this device. Search a city or state instead.");
      return;
    }
    setLocating(true);
    setStatus("Asking for approximate location…");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch("/api/locate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            }),
          });
          const data = await res.json();
          if (data?.destination?.slug) {
            const city = data.destination;
            const stateSlug = city.parent_slug ?? city.slug;
            setStatus(`Near ${city.name}. Opening the state story first.`);
            router.push(`/places/${stateSlug}?from=location&city=${city.slug}`);
          } else {
            setStatus("Could not match a pilot place. Try searching Udaipur or Rajasthan.");
          }
        } catch {
          setStatus("Location lookup failed. Try a manual search.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setStatus("Location denied or unavailable. Search a city or state. The app stays open.");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  }

  return (
    <section
      className={`rounded-2xl bg-[var(--bg)] p-5 shadow-[var(--shadow)] outline outline-1 outline-[var(--line)] ${
        compact ? "" : "jali-accent"
      }`}
      aria-labelledby="where-heading"
    >
      <h2 id="where-heading" className="serif text-2xl">
        Where are you?
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
        We use approximate location only to open the nearest pilot city. You can always search
        instead. Denying permission never blocks the app.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={locating}
          onClick={useLocation}
          className="btn inline-flex min-h-12 items-center rounded-full bg-[var(--primary)] px-5 text-sm text-[var(--on-primary)] hover:bg-[var(--primary-hover)] disabled:opacity-70"
        >
          {locating ? "Locating…" : "Use approximate location"}
        </button>
      </div>
      <label className="mt-4 block text-sm font-medium text-[var(--ink)]" htmlFor="place-search">
        Or search a city or state
      </label>
      <input
        id="place-search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Udaipur, Rajasthan, Jaipur…"
        className="mt-2 w-full min-h-12 rounded-xl bg-[var(--surface)] px-4 outline outline-1 outline-[var(--line)]"
      />
      <ul className="mt-3 max-h-48 space-y-1 overflow-y-auto">
        {matches.slice(0, 8).map((d) => (
          <li key={d.slug}>
            <button
              type="button"
              className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-left text-sm hover:bg-[var(--surface)]"
              onClick={() => router.push(`/places/${d.slug}`)}
            >
              <span>
                <span className="font-medium text-[var(--ink)]">{d.name}</span>
                <span className="text-[var(--muted)]">
                  {" "}
                  · {d.kind === "state" ? "State story" : d.state_ut}
                </span>
              </span>
              <span className="text-[var(--primary)]">Open</span>
            </button>
          </li>
        ))}
      </ul>
      {status ? (
        <p className="mt-3 text-sm text-[var(--ink-soft)]" role="status">
          {status}
        </p>
      ) : null}
    </section>
  );
}
