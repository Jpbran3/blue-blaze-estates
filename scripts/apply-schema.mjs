// One-shot: create the database tables on the configured Turso/libSQL database
// from a SQL DDL file, connecting exactly the way the app does
// (PrismaLibSql uses @libsql/client under the hood).
//
// Usage:
//   node scripts/apply-schema.mjs <path-to-sql>
//
// Requires TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in the environment
// (e.g. `vercel env pull .env.production.local` then load it).
import { readFileSync } from "node:fs";
import { createClient } from "@libsql/client";

const sqlPath = process.argv[2];
if (!sqlPath) {
  console.error("Usage: node scripts/apply-schema.mjs <path-to-sql>");
  process.exit(1);
}

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url) {
  console.error("Missing TURSO_DATABASE_URL");
  process.exit(1);
}

const sql = readFileSync(sqlPath, "utf8");
const client = createClient({ url, authToken });

console.log(`Applying schema to: ${url.replace(/\?.*$/, "")}`);
try {
  await client.executeMultiple(sql);
  const tables = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
  );
  console.log("✓ Done. Tables now present:");
  for (const row of tables.rows) console.log("  -", row.name);
} catch (err) {
  console.error("✗ Failed:", err?.message ?? err);
  process.exit(1);
}
