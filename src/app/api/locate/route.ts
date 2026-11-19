import { findNearestDestination } from "@/lib/destinations";
import { clientIp, isRateLimited } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  if (isRateLimited(`locate:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: "Rate limit" }, { status: 429 });
  }

  let body: { lat?: number; lng?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const lat = Number(body.lat);
  const lng = Number(body.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  const match = findNearestDestination(lat, lng);
  if (!match) {
    return NextResponse.json({ destination: null });
  }

  return NextResponse.json({
    destination: {
      slug: match.destination.slug,
      name: match.destination.name,
      parent_slug: match.destination.parent_slug,
      kind: match.destination.kind,
    },
    distanceKm: Math.round(match.distanceKm * 10) / 10,
    note: "Approximate match only. Exact GPS is not stored.",
  });
}
