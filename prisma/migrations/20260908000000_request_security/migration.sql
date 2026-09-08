-- Additive only. Adds the manual-review preference and the shared rate-limit
-- table. No column is dropped and no applicant row is rewritten.
--
-- NOTE: prisma/migrations does NOT reproduce the production schema — it is ~40
-- columns behind prisma/schema.prisma because earlier columns were applied with
-- ad-hoc scripts (prisma/migrate.ts, migrate-archive.ts, migrate-listing-images.ts).
-- For production use scripts/migrate-compliance.ts, which inspects the live table
-- and adds only what is missing, so it is safe to re-run and safe on a database
-- that never tracked these migrations.
ALTER TABLE "Application" ADD COLUMN "manualReviewRequested" BOOLEAN NOT NULL DEFAULT false;
CREATE TABLE "RateLimit" ("key" TEXT NOT NULL PRIMARY KEY, "attempts" INTEGER NOT NULL, "resetAt" BIGINT NOT NULL);
CREATE INDEX "RateLimit_resetAt_idx" ON "RateLimit"("resetAt");
