import { cookies } from "next/headers";
import crypto from "crypto";
import { createSession, validSession, SESSION_SECONDS } from "@/lib/session";

/**
 * Shared admin auth.
 *
 * Two problems this fixes:
 *
 * 1. Each API route previously inlined `process.env.ADMIN_PASSWORD ?? "changeme"`,
 *    so a missing env var silently made "changeme" a working password for the
 *    dashboard holding every applicant's personal data. Auth now fails closed.
 *
 * 2. The cookie used to be a bare SHA-256 of the password — a deterministic value
 *    with no expiry the server could enforce. It never changed, so it could not be
 *    revoked, and the 7-day Max-Age was only a browser-side hint a client could
 *    ignore. It is now an HMAC-signed token carrying its own expiry timestamp,
 *    which the server checks on every request (lib/session.ts).
 */

export const ADMIN_SESSION_COOKIE = "admin_session";
export { SESSION_SECONDS };

/** The configured admin password, or null if it isn't usably set. */
function configuredPassword(): string | null {
  const raw = process.env.ADMIN_PASSWORD?.trim();
  if (!raw) {
    console.error(
      "ADMIN_PASSWORD is not set — refusing all admin access. " +
        "Set it in the Vercel project environment variables."
    );
    return null;
  }
  return raw;
}

/** Constant-time compare so the password can't be recovered by timing. */
function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/** True only when the cookie holds a valid, unexpired, correctly signed token. */
export async function isAuthenticated(): Promise<boolean> {
  const adminPassword = configuredPassword();
  if (!adminPassword) return false;

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return false;

  return validSession(token, adminPassword);
}

/** Checks a submitted login password. Always false when none is configured. */
export function verifyPassword(submitted: unknown): boolean {
  const adminPassword = configuredPassword();
  if (!adminPassword) return false;
  if (typeof submitted !== "string") return false;

  const candidate = submitted.trim();
  if (!candidate) return false;

  return safeEqual(candidate, adminPassword);
}

/** A freshly signed session token, or null when no password is configured. */
export function sessionValue(): string | null {
  const adminPassword = configuredPassword();
  return adminPassword ? createSession(adminPassword) : null;
}
