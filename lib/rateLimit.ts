import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

const digest = (name: string) => createHash("sha256").update(name).digest("hex");

function clientName(request: Request, scope: string) {
  // Vercel overwrites this header at its edge. Do not trust a caller's X-Forwarded-For.
  const ip = process.env.VERCEL === "1"
    ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() || "unknown"
    : "local";
  return `${scope}:${ip}`;
}

/** Per-client limit; stores no raw IP. */
export async function rateLimit(request: Request, scope: string, limit: number, windowSeconds: number) {
  return countAttempt(clientName(request, scope), limit, windowSeconds);
}

/** Forgets this client's attempts in a scope, e.g. once an admin signs in with the right password. */
export async function clearAttempts(request: Request, scope: string) {
  await prisma.$executeRaw`DELETE FROM "RateLimit" WHERE "key" = ${digest(clientName(request, scope))}`;
}

/** Atomic database counter shared by all server instances; stores only a digest of the name. */
export async function countAttempt(name: string, limit: number, windowSeconds: number) {
  const now = Date.now();
  const key = digest(name);
  const resetAt = now + windowSeconds * 1000;
  const rows = await prisma.$queryRaw<Array<{ attempts: number; resetAt: bigint | number }>>`
    INSERT INTO "RateLimit" ("key", "attempts", "resetAt") VALUES (${key}, 1, ${resetAt})
    ON CONFLICT("key") DO UPDATE SET
      "attempts" = CASE WHEN "resetAt" <= ${now} THEN 1 ELSE "attempts" + 1 END,
      "resetAt" = CASE WHEN "resetAt" <= ${now} THEN ${resetAt} ELSE "resetAt" END
    RETURNING "attempts", "resetAt"`;
  await prisma.$executeRaw`DELETE FROM "RateLimit" WHERE "resetAt" < ${now - 86400000}`;
  return {
    allowed: Number(rows[0].attempts) <= limit,
    retryAfter: Math.max(1, Math.ceil((Number(rows[0].resetAt) - now) / 1000)),
  };
}
