import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const SESSION_SECONDS = 60 * 60 * 24 * 7;

function signature(payload: string, password: string) {
  return createHmac("sha256", password).update(`blue-blaze-admin:${payload}`).digest("base64url");
}

export function createSession(password: string, now = Date.now()) {
  const payload = `${Math.floor(now / 1000) + SESSION_SECONDS}.${randomBytes(24).toString("base64url")}`;
  return `${payload}.${signature(payload, password)}`;
}

export function validSession(token: string, password: string, now = Date.now()) {
  const parts = token.split(".");
  if (parts.length !== 3 || !/^\d{10}$/.test(parts[0]) || !/^[\w-]{32}$/.test(parts[1])) return false;
  const expiry = Number(parts[0]);
  const seconds = Math.floor(now / 1000);
  if (expiry <= seconds || expiry > seconds + SESSION_SECONDS) return false;
  const expected = Buffer.from(signature(`${parts[0]}.${parts[1]}`, password));
  const supplied = Buffer.from(parts[2]);
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}
