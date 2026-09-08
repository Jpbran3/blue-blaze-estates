import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

/** Atomic database counter shared by all server instances; stores no raw IP. */
export async function rateLimit(request: Request, scope: string, limit: number, windowSeconds: number) {
  // Vercel overwrites this header at its edge. Do not trust a caller's X-Forwarded-For.
  const ip = process.env.VERCEL === "1"
    ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() || "unknown"
    : "local";
  const now = Date.now();
  const key = createHash("sha256").update(`${scope}:${ip}`).digest("hex");
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
