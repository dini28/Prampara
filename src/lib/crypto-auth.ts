import { createHash, scryptSync, timingSafeEqual } from "crypto";
import { getAdminSecretPlain, getSessionSecret } from "@/lib/admin-config";

const SCRYPT_KEYLEN = 32;

function adminSalt(): Buffer {
  const fromEnv = process.env.PARAMPARA_ADMIN_SALT;
  if (fromEnv && fromEnv.length >= 16) {
    return Buffer.from(fromEnv.slice(0, 64), "utf8");
  }
  return createHash("sha256").update(`pp-salt:${getSessionSecret()}`).digest();
}

/** Hash a password/secret with scrypt (Node-only , use in Server Actions / Route Handlers). */
export function hashSecret(plain: string): string {
  const hash = scryptSync(plain, adminSalt(), SCRYPT_KEYLEN);
  return hash.toString("hex");
}

export function verifyAdminSecret(submitted: string): boolean {
  const expectedHashEnv = process.env.PARAMPARA_ADMIN_SECRET_HASH?.trim();
  const submittedHash = hashSecret(submitted);

  if (expectedHashEnv && /^[a-f0-9]{64}$/i.test(expectedHashEnv)) {
    try {
      return timingSafeEqual(
        Buffer.from(submittedHash, "hex"),
        Buffer.from(expectedHashEnv.toLowerCase(), "hex"),
      );
    } catch {
      return false;
    }
  }

  const expected = hashSecret(getAdminSecretPlain());
  try {
    return timingSafeEqual(Buffer.from(submittedHash, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}
