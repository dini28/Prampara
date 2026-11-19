type Bucket = { n: number; t: number };

const buckets = new Map<string, Bucket>();

/**
 * Simple in-memory sliding window. Fine for single-node student MVP.
 * Returns true when the caller should be blocked.
 */
export function isRateLimited(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const row = buckets.get(key) ?? { n: 0, t: now };
  if (now - row.t > windowMs) {
    row.n = 0;
    row.t = now;
  }
  row.n += 1;
  buckets.set(key, row);
  return row.n > limit;
}

export function clientIp(requestHeaders: Headers): string {
  return (
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "local"
  );
}
