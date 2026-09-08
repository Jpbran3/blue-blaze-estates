ALTER TABLE "Application" ADD COLUMN "manualReviewRequested" BOOLEAN NOT NULL DEFAULT false;
CREATE TABLE "RateLimit" ("key" TEXT NOT NULL PRIMARY KEY, "attempts" INTEGER NOT NULL, "resetAt" BIGINT NOT NULL);
CREATE INDEX "RateLimit_resetAt_idx" ON "RateLimit"("resetAt");
