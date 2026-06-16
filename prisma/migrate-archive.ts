import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN;
const client = createClient({ url, authToken });

async function main() {
  try {
    await client.execute(
      `ALTER TABLE Application ADD COLUMN "archived" INTEGER NOT NULL DEFAULT 0`
    );
    console.log("Added column: archived");
  } catch {
    console.log("Skipped: archived (already exists)");
  }
  console.log("Migration complete!");
  client.close();
}

main().catch(console.error);
