import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  const r = await client.execute(
    "UPDATE City SET imageUrl = '/images/east-alton-mobile-homes.jpg' WHERE slug = 'east-alton-il-mobile-homes'"
  );
  console.log("Updated rows:", r.rowsAffected);
  client.close();
}

main().catch(console.error);
