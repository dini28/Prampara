"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  CSRF_COOKIE,
  getAdminBasePath,
  SESSION_MAX_AGE_SEC,
  STAFF_SESSION_COOKIE,
} from "@/lib/admin-config";
import { verifyAdminSecret } from "@/lib/crypto-auth";
import { clientIp, isRateLimited } from "@/lib/rate-limit";
import { appendAudit, moderateContribution } from "@/lib/runtime-store";
import { createCsrfToken, createStaffSession } from "@/lib/session-token";
import { isStaff, verifySameOrigin, verifyStaffCsrf } from "@/lib/staff";
import { validateModerationStatus, validatePlaceDraft } from "@/lib/validate";

function cookieSecure(): boolean {
  return process.env.NODE_ENV === "production";
}

export async function staffLogin(formData: FormData) {
  const h = await headers();
  const ip = clientIp(h);
  if (isRateLimited(`staff-login:${ip}`, 8, 60_000)) {
    redirect(`${getAdminBasePath()}?error=rate`);
  }

  if (!(await verifySameOrigin())) {
    redirect(`${getAdminBasePath()}?error=csrf`);
  }

  const secret = String(formData.get("secret") ?? "");
  if (!verifyAdminSecret(secret)) {
    appendAudit({
      action: "login_failed",
      actor: "anonymous",
      detail: `ip=${ip}`,
    });
    redirect(`${getAdminBasePath()}?error=1`);
  }

  const session = await createStaffSession();
  const csrf = createCsrfToken();
  const jar = await cookies();
  jar.set(STAFF_SESSION_COOKIE, session, {
    httpOnly: true,
    sameSite: "strict",
    secure: cookieSecure(),
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });
  jar.set(CSRF_COOKIE, csrf, {
    httpOnly: true,
    sameSite: "strict",
    secure: cookieSecure(),
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });

  appendAudit({
    action: "login_success",
    actor: "staff",
    detail: `ip=${ip}`,
  });

  redirect(`${getAdminBasePath()}/queue`);
}

export async function staffLogout() {
  const jar = await cookies();
  jar.delete(STAFF_SESSION_COOKIE);
  jar.delete(CSRF_COOKIE);
  appendAudit({
    action: "logout",
    actor: "staff",
    detail: "session cleared",
  });
  redirect(getAdminBasePath());
}

export async function reviewContribution(formData: FormData) {
  if (!(await isStaff())) redirect(getAdminBasePath());
  if (!(await verifySameOrigin()) || !(await verifyStaffCsrf(formData))) {
    redirect(`${getAdminBasePath()}/queue?error=csrf`);
  }

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !validateModerationStatus(status)) {
    redirect(`${getAdminBasePath()}/queue?error=invalid`);
  }

  const row = moderateContribution(id, status);
  appendAudit({
    action: `contribution_${status}`,
    actor: "staff",
    detail: `id=${id}; slug=${row?.itemSlug ?? "unknown"}`,
  });
  redirect(`${getAdminBasePath()}/queue`);
}

/**
 * Validates a place/card draft for accuracy — used by the staff catalogue check form.
 * Does not mutate the published catalogue JSON in this MVP (read-only seed);
 * records an audit entry when validation passes.
 */
export async function validateCatalogueDraft(formData: FormData) {
  if (!(await isStaff())) redirect(getAdminBasePath());
  if (!(await verifySameOrigin()) || !(await verifyStaffCsrf(formData))) {
    redirect(`${getAdminBasePath()}/queue?error=csrf`);
  }

  const draft = {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? "").trim().toLowerCase(),
    type: String(formData.get("type") ?? ""),
    region_slug: String(formData.get("region_slug") ?? ""),
    lat: formData.get("lat") ? Number(formData.get("lat")) : null,
    lng: formData.get("lng") ? Number(formData.get("lng")) : null,
    summary: String(formData.get("summary") ?? ""),
    body: String(formData.get("body") ?? ""),
    sourceUrl: String(formData.get("sourceUrl") ?? ""),
    sourceTitle: String(formData.get("sourceTitle") ?? ""),
  };

  const issues = validatePlaceDraft(draft);
  if (issues.length) {
    const msg = encodeURIComponent(issues.map((i) => i.message).join(" · "));
    redirect(`${getAdminBasePath()}/queue?error=validation&msg=${msg}`);
  }

  appendAudit({
    action: "place_draft_validated",
    actor: "staff",
    detail: `slug=${draft.slug}; region=${draft.region_slug}; type=${draft.type}`,
  });
  redirect(`${getAdminBasePath()}/queue?ok=validated`);
}
