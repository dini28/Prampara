"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BottomSheet } from "@/components/BottomSheet";
import { GEO_CACHE_KEY, GEO_CONSENT_KEY, haversineKm, type LatLng } from "@/lib/geo";
import { haptic } from "@/lib/haptics";
import { TYPE_LABEL } from "@/lib/catalogue";

export type MapPlace = {
  slug: string;
  title: string;
  type: string;
  regionName: string;
  regionSlug: string;
  lat: number;
  lng: number;
  summary: string;
  lesserKnown: boolean;
  bestSeason: string;
  howToReach: string;
  respectfulTips: string;
  story: string;
};

type Props = {
  places: MapPlace[];
};

type LeafletNs = {
  map: (
    el: HTMLElement,
    opts?: { scrollWheelZoom?: boolean; zoomControl?: boolean },
  ) => LeafletMap;
  tileLayer: (
    url: string,
    opts?: { attribution?: string; maxZoom?: number },
  ) => { addTo: (m: LeafletMap) => void };
  circleMarker: (
    latlng: [number, number],
    opts?: Record<string, unknown>,
  ) => LeafletMarker;
};

type LeafletMap = {
  setView: (latlng: [number, number], zoom: number) => LeafletMap;
  remove: () => void;
};

type LeafletMarker = {
  addTo: (m: LeafletMap) => LeafletMarker;
  bindPopup: (html: string) => LeafletMarker;
  on: (ev: string, fn: () => void) => void;
};

declare global {
  interface Window {
    L?: LeafletNs;
  }
}

function loadLeaflet(): Promise<LeafletNs> {
  return new Promise((resolve, reject) => {
    if (window.L) {
      resolve(window.L);
      return;
    }
    const cssId = "leaflet-css";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => {
      if (window.L) resolve(window.L);
      else reject(new Error("Leaflet failed to load"));
    };
    script.onerror = () => reject(new Error("Leaflet failed to load"));
    document.body.appendChild(script);
  });
}

export function HeritageMap({ places }: Props) {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [userPos, setUserPos] = useState<LatLng | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [consentAsked, setConsentAsked] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [sheetPlace, setSheetPlace] = useState<MapPlace | null>(null);
  const [manualRegion, setManualRegion] = useState("");

  const filtered = useMemo(() => {
    let list = places;
    if (filter !== "all") list = list.filter((p) => p.type === filter);
    if (userPos) {
      list = [...list].sort(
        (a, b) =>
          haversineKm(userPos, { lat: a.lat, lng: a.lng }) -
          haversineKm(userPos, { lat: b.lat, lng: b.lng }),
      );
    }
    return list;
  }, [places, filter, userPos]);

  const nearby = useMemo(() => {
    if (!userPos) return filtered.slice(0, 8);
    return filtered.slice(0, 8);
  }, [filtered, userPos]);

  const requestGeo = useCallback(() => {
    setConsentAsked(true);
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not available on this device. Pick a state below.");
      return;
    }
    localStorage.setItem(GEO_CONSENT_KEY, "1");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserPos(coords);
        setGeoError(null);
        sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(coords));
        haptic(10);
        // Coords stay on-device only , never posted to our API
      },
      () => {
        setGeoError("Location denied. Use the state picker to explore nearby heritage.");
        localStorage.setItem(GEO_CONSENT_KEY, "0");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 120000 },
    );
  }, []);

  useEffect(() => {
    const cached = sessionStorage.getItem(GEO_CACHE_KEY);
    const consent = localStorage.getItem(GEO_CONSENT_KEY);
    if (cached && consent === "1") {
      try {
        setUserPos(JSON.parse(cached) as LatLng);
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!mapEl.current) return;
      try {
        const L = await loadLeaflet();
        if (cancelled || !mapEl.current) return;
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
        const center: LatLng = userPos ?? { lat: 22.5, lng: 79 };
        const map = L.map(mapEl.current, {
          scrollWheelZoom: false,
          zoomControl: true,
        }).setView([center.lat, center.lng], userPos ? 6 : 5);

        // Cache-friendly OSM tiles; browser HTTP cache handles repeat views
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap",
          maxZoom: 18,
        }).addTo(map);

        if (userPos) {
          L.circleMarker([userPos.lat, userPos.lng], {
            radius: 8,
            color: "#2563eb",
            fillColor: "#3b82f6",
            fillOpacity: 0.9,
          })
            .addTo(map)
            .bindPopup("You are here (on-device only)");
        }

        for (const p of filtered) {
          const marker = L.circleMarker([p.lat, p.lng], {
            radius: p.lesserKnown ? 7 : 6,
            color: p.lesserKnown ? "#0f766e" : "#1e3a5f",
            fillColor: p.lesserKnown ? "#14b8a6" : "#3b82f6",
            fillOpacity: 0.85,
          }).addTo(map);
          marker.on("click", () => {
            haptic(8);
            setSheetPlace(p);
          });
        }

        mapRef.current = map;
      } catch {
        setGeoError((e) => e ?? "Map failed to load. You can still browse the list below.");
      }
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [filtered, userPos]);

  const regions = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of places) map.set(p.regionSlug, p.regionName);
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [places]);

  useEffect(() => {
    if (!manualRegion) return;
    const hit = places.find((p) => p.regionSlug === manualRegion);
    if (hit) {
      setUserPos({ lat: hit.lat, lng: hit.lng });
      haptic(8);
    }
  }, [manualRegion, places]);

  return (
    <div className="space-y-6">
      {!consentAsked && !userPos ? (
        <div className="rounded-2xl bg-[var(--primary-tint)] p-4 outline outline-1 outline-[var(--primary)]/20">
          <p className="font-medium text-[var(--primary-deep)]">Use your location?</p>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">
            We stay on your device , coordinates are not sent to our servers. Deny anytime and pick
            a state instead.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={requestGeo}
              className="btn min-h-11 touch-manipulation select-none rounded-full bg-[var(--primary)] px-5 text-sm text-[var(--on-primary)]"
            >
              Allow location
            </button>
            <button
              type="button"
              onClick={() => {
                setConsentAsked(true);
                setGeoError("Using state picker instead.");
              }}
              className="btn min-h-11 touch-manipulation select-none rounded-full border border-[var(--line-strong)] px-5 text-sm"
            >
              Not now
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <label className="sr-only" htmlFor="map-region">
          Pick a state
        </label>
        <select
          id="map-region"
          value={manualRegion}
          onChange={(e) => setManualRegion(e.target.value)}
          className="min-h-12 min-w-[12rem] flex-1 rounded-xl bg-[var(--surface)] px-4 outline outline-1 outline-[var(--line)]"
        >
          <option value="">Manual state / region…</option>
          {regions.map(([slug, name]) => (
            <option key={slug} value={slug}>
              {name}
            </option>
          ))}
        </select>
        <select
          aria-label="Category filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="min-h-12 rounded-xl bg-[var(--surface)] px-4 outline outline-1 outline-[var(--line)]"
        >
          <option value="all">All categories</option>
          {Object.entries(TYPE_LABEL).map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </select>
        {consentAsked && !userPos ? (
          <button
            type="button"
            onClick={requestGeo}
            className="btn min-h-12 touch-manipulation select-none rounded-full border border-[var(--line-strong)] px-4 text-sm"
          >
            Retry location
          </button>
        ) : null}
      </div>

      {geoError ? (
        <p className="text-sm text-[var(--ink-soft)]" role="status">
          {geoError}
        </p>
      ) : null}

      <div
        ref={mapEl}
        className="h-[min(55dvh,420px)] w-full overflow-hidden rounded-2xl outline outline-1 outline-[var(--line)] [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full"
        role="application"
        aria-label="Heritage map of India"
      />

      <section aria-labelledby="nearby-heading">
        <h2 id="nearby-heading" className="serif text-2xl">
          {userPos ? "Near you" : "Places on the map"}
        </h2>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">
          Heritage sites, festivals, crafts, folk arts, temples, myths, and off-the-beaten-path
          villages , teal markers highlight lesser-known practices.
        </p>
        <ul className="mt-4 space-y-3">
          {nearby.map((p) => {
            const km = userPos
              ? haversineKm(userPos, { lat: p.lat, lng: p.lng }).toFixed(0)
              : null;
            return (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => {
                    haptic(8);
                    setSheetPlace(p);
                  }}
                  className="flex w-full min-h-14 touch-manipulation select-none items-start gap-3 rounded-2xl bg-[var(--surface)] px-4 py-3 text-left outline outline-1 outline-[var(--line)] [-webkit-tap-highlight-color:transparent]"
                >
                  <span className="mt-1 size-2.5 shrink-0 rounded-full bg-[var(--primary)]" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-[var(--ink)]">
                      {p.title}
                      {p.lesserKnown ? (
                        <span className="ml-2 text-xs font-medium text-[var(--verified)]">
                          Lesser-known
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-xs text-[var(--muted)]">
                      {TYPE_LABEL[p.type as keyof typeof TYPE_LABEL] ?? p.type} · {p.regionName}
                      {km ? ` · ~${km} km` : ""}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <BottomSheet
        open={Boolean(sheetPlace)}
        title={sheetPlace?.title ?? ""}
        onClose={() => setSheetPlace(null)}
      >
        {sheetPlace ? (
          <div className="space-y-4 text-sm leading-relaxed text-[var(--ink-soft)]">
            <p className="text-[var(--ink)]">{sheetPlace.summary}</p>
            <div>
              <h3 className="font-medium text-[var(--ink)]">Story / mythology</h3>
              <p className="mt-1">{sheetPlace.story}</p>
            </div>
            <div>
              <h3 className="font-medium text-[var(--ink)]">Best season</h3>
              <p className="mt-1">{sheetPlace.bestSeason}</p>
            </div>
            <div>
              <h3 className="font-medium text-[var(--ink)]">How to reach</h3>
              <p className="mt-1">{sheetPlace.howToReach}</p>
            </div>
            <div>
              <h3 className="font-medium text-[var(--ink)]">Respectful visit</h3>
              <p className="mt-1">{sheetPlace.respectfulTips}</p>
            </div>
            <Link
              href={`/items/${sheetPlace.slug}`}
              className="btn inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--primary)] text-[var(--on-primary)]"
            >
              Open full card
            </Link>
          </div>
        ) : null}
      </BottomSheet>
    </div>
  );
}
