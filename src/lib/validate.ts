import { getItemBySlug, getRegionBySlug } from "@/lib/catalogue";
import type { HeritageType } from "@/lib/types";

const HERITAGE_TYPES = new Set<HeritageType>([
  "festival",
  "craft",
  "performing",
  "oral",
  "ritual",
  "knowledge",
]);

export type ValidationIssue = { field: string; message: string };

export type PlaceDraft = {
  title: string;
  slug: string;
  type: string;
  region_slug: string;
  lat: number | null;
  lng: number | null;
  summary: string;
  body: string;
  sourceUrl: string;
  sourceTitle: string;
};

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validatePlaceDraft(
  draft: PlaceDraft,
  opts?: { existingSlug?: string },
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!draft.title?.trim() || draft.title.trim().length < 3) {
    issues.push({ field: "title", message: "Place title is required (3+ characters)." });
  }
  if (!draft.slug?.trim() || !SLUG_RE.test(draft.slug)) {
    issues.push({
      field: "slug",
      message: "Slug is required (lowercase letters, numbers, hyphens).",
    });
  } else if (getItemBySlug(draft.slug) && draft.slug !== opts?.existingSlug) {
    issues.push({ field: "slug", message: "A card with this slug already exists." });
  }

  if (!HERITAGE_TYPES.has(draft.type as HeritageType)) {
    issues.push({ field: "type", message: "Category (heritage type) is required." });
  }

  if (!draft.region_slug?.trim()) {
    issues.push({ field: "region_slug", message: "State / region is required." });
  } else if (!getRegionBySlug(draft.region_slug)) {
    issues.push({ field: "region_slug", message: "Unknown state / region slug." });
  }

  const region = draft.region_slug ? getRegionBySlug(draft.region_slug) : undefined;
  const lat = draft.lat ?? region?.lat ?? null;
  const lng = draft.lng ?? region?.lng ?? null;
  if (lat === null || lng === null || Number.isNaN(lat) || Number.isNaN(lng)) {
    issues.push({
      field: "coordinates",
      message: "Coordinates (lat/lng) are required — set on the place or its region.",
    });
  } else if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    issues.push({ field: "coordinates", message: "Coordinates out of valid range." });
  }

  if (!draft.sourceUrl?.trim() || !draft.sourceTitle?.trim()) {
    issues.push({ field: "source", message: "At least one source (title + URL) is required." });
  } else {
    try {
      const u = new URL(draft.sourceUrl);
      if (u.protocol !== "https:" && u.protocol !== "http:") {
        issues.push({ field: "source", message: "Source URL must be http(s)." });
      }
    } catch {
      issues.push({ field: "source", message: "Source URL is invalid." });
    }
  }

  if (!draft.summary?.trim() || draft.summary.trim().length < 40) {
    issues.push({ field: "summary", message: "Summary is required (40+ characters)." });
  }

  return issues;
}

export function validateContributionBody(body: string): ValidationIssue[] {
  const text = body.trim();
  if (text.length < 40) {
    return [{ field: "body", message: "Need a real memory (40+ characters)." }];
  }
  if (text.length > 4000) {
    return [{ field: "body", message: "Contribution is too long (max 4000 characters)." }];
  }
  return [];
}

export function validateModerationStatus(status: string): status is "accepted" | "rejected" {
  return status === "accepted" || status === "rejected";
}
