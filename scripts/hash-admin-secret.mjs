#!/usr/bin/env node
/**
 * Usage: node scripts/hash-admin-secret.mjs "your-secret"
 * Must use the same PARAMPARA_ADMIN_SALT / PARAMPARA_SESSION_SECRET as the app.
 */
import { createHash, scryptSync } from "crypto";

const secret = process.argv[2];
if (!secret) {
  console.error('Usage: node scripts/hash-admin-secret.mjs "your-secret"');
  process.exit(1);
}

const sessionSecret =
  process.env.PARAMPARA_SESSION_SECRET ||
  process.env.PARAMPARA_ADMIN_SECRET ||
  "parampara-dev-session-change-me";

const fromEnv = process.env.PARAMPARA_ADMIN_SALT;
const salt =
  fromEnv && fromEnv.length >= 16
    ? Buffer.from(fromEnv.slice(0, 64), "utf8")
    : createHash("sha256").update(`pp-salt:${sessionSecret}`).digest();

const hash = scryptSync(secret, salt, 32).toString("hex");
console.log(`PARAMPARA_ADMIN_SECRET_HASH=${hash}`);
