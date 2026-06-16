import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env") });
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.TURSO_DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN;
const client = createClient({ url, authToken });

async function main() {
  try {
    await client.execute(`ALTER TABLE "Listing" ADD COLUMN "images" TEXT`);
    console.log("Added column: images");
  } catch {
    console.log("Skipped: images (already exists)");
  }
  console.log("Migration complete!");
  client.close();
}

main().catch(console.error);
