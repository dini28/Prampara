import { cookies, headers } from "next/headers";
import { CSRF_COOKIE, CSRF_FIELD, STAFF_SESSION_COOKIE } from "@/lib/admin-config";
import { parseStaffSession, timingSafeStringEqual } from "@/lib/session-token";

export async function isStaff(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(STAFF_SESSION_COOKIE)?.value;
  return (await parseStaffSession(token)) !== null;
}

/** Verify double-submit CSRF for staff mutations. */
export async function verifyStaffCsrf(formData: FormData): Promise<boolean> {
  const jar = await cookies();
  const cookieToken = jar.get(CSRF_COOKIE)?.value ?? "";
  const formToken = String(formData.get(CSRF_FIELD) ?? "");
  if (!cookieToken || !formToken) return false;
  return timingSafeStringEqual(cookieToken, formToken);
}

/** Reject cross-site POSTs that omit a matching Origin/Referer host. */
export async function verifySameOrigin(): Promise<boolean> {
  const h = await headers();
  const origin = h.get("origin");
  const host = h.get("host");
  if (!host) return false;
  if (!origin) {
    const referer = h.get("referer");
    if (!referer) return true;
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
