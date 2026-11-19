import { cookies } from "next/headers";
import { CSRF_COOKIE, CSRF_FIELD } from "@/lib/admin-config";

/** Hidden CSRF input for staff forms (double-submit cookie pattern). */
export async function CsrfField() {
  const jar = await cookies();
  const token = jar.get(CSRF_COOKIE)?.value ?? "";
  return <input type="hidden" name={CSRF_FIELD} value={token} />;
}
