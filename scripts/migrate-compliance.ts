import { createClient } from "@libsql/client";

// Additive only: never drop columns, rewrite applications, or purge applicant data.
async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url || url === "[SENSITIVE]") throw new Error("A usable database connection is required.");
  const client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
  const transaction = await client.transaction("write");
  try {
    const columns = await transaction.execute('PRAGMA table_info("Application")');
    if (!columns.rows.length) throw new Error("Application table must exist before this migration.");
    const names = new Set(columns.rows.map(row => String(row.name)));
    if (!names.has("occupantCount")) await transaction.execute('ALTER TABLE "Application" ADD COLUMN "occupantCount" TEXT');
    if (!names.has("manualReviewRequested")) await transaction.execute('ALTER TABLE "Application" ADD COLUMN "manualReviewRequested" BOOLEAN NOT NULL DEFAULT false');
    await transaction.execute('CREATE TABLE IF NOT EXISTS "RateLimit" ("key" TEXT PRIMARY KEY NOT NULL, "attempts" INTEGER NOT NULL, "resetAt" BIGINT NOT NULL)');
    await transaction.execute('CREATE INDEX IF NOT EXISTS "RateLimit_resetAt_idx" ON "RateLimit"("resetAt")');
    await transaction.commit();
    console.log("Compliance schema is ready; existing application data was preserved.");
  } catch {
    await transaction.rollback();
    throw new Error("Compliance migration failed; no changes were committed.");
  } finally { transaction.close(); client.close(); }
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
