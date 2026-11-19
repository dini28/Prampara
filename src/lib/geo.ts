import type { HeritageItem, Region } from "@/lib/types";
import { getItems, getRegionBySlug } from "@/lib/catalogue";

export type LatLng = { lat: number; lng: number };

export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function regionCoords(region: Region | undefined): LatLng | null {
  if (!region || region.lat == null || region.lng == null) return null;
  return { lat: region.lat, lng: region.lng };
}

export type NearbyPlace = {
  item: HeritageItem;
  region: Region | undefined;
  distanceKm: number;
};

export function nearbyPlaces(origin: LatLng, limit = 12): NearbyPlace[] {
  const rows: NearbyPlace[] = [];
  for (const item of getItems()) {
    const region = getRegionBySlug(item.region_slug);
    const coords = regionCoords(region);
    if (!coords) continue;
    rows.push({
      item,
      region,
      distanceKm: haversineKm(origin, coords),
    });
  }
  return rows.sort((a, b) => a.distanceKm - b.distanceKm).slice(0, limit);
}

/** Client-side consent flag — never send raw coords to the server without this. */
export const GEO_CONSENT_KEY = "pp_geo_consent";
export const GEO_CACHE_KEY = "pp_geo_last";
