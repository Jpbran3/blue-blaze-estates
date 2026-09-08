import { cookies } from "next/headers";
import crypto from "crypto";
import { createSession, validSession } from "./session";

/**
 * Shared admin auth. Previously each API route inlined
 * `process.env.ADMIN_PASSWORD ?? "changeme"`, which meant a missing or empty
 * env var silently made "changeme" a working password for the dashboard that
 * holds every applicant's personal data. Auth now fails closed instead.
 */

export const ADMIN_SESSION_COOKIE = "admin_session";


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

/** True only when a valid session cookie matches a configured password. */
export async function isAuthenticated(): Promise<boolean> {
  const adminPassword = configuredPassword();
  if (!adminPassword) return false;

  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);
  if (!session?.value) return false;

  return validSession(session.value, adminPassword);
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

/** The cookie value to set on a successful login. */
export function sessionValue(): string | null {
  const adminPassword = configuredPassword();
  return adminPassword ? createSession(adminPassword) : null;
}
