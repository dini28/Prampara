/**
 * Admin portal is never linked publicly. Access only via an unguessable path
 * from PARAMPARA_ADMIN_PATH (e.g. /desk-k9m2x7q). Internal pages live under /staff.
 */

export function getAdminPathSegment(): string {
  const raw = (process.env.PARAMPARA_ADMIN_PATH ?? "desk-k9m2x7q").trim();
  // Prevent empty / path-traversal style values
  if (!raw || raw.includes("/") || raw.includes("..") || raw.startsWith("_")) {
    return "desk-k9m2x7q";
  }
  return raw;
}

export function getAdminBasePath(): string {
  return `/${getAdminPathSegment()}`;
}

export function getSessionSecret(): string {
  return (
    process.env.PARAMPARA_SESSION_SECRET ??
    process.env.PARAMPARA_ADMIN_SECRET ??
    "parampara-dev-session-change-me"
  );
}

export function getAdminSecretPlain(): string {
  return process.env.PARAMPARA_ADMIN_SECRET ?? "parampara-demo";
}

/** Cookie names , not guessable from "admin" alone. */
export const STAFF_SESSION_COOKIE = "pp_sess";
export const CSRF_COOKIE = "pp_csrf";
export const CSRF_FIELD = "pp_csrf_token";

export const SESSION_MAX_AGE_SEC = 60 * 60 * 8; // 8 hours
