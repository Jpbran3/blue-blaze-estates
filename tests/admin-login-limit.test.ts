import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createClient } from "@libsql/client";
import { NextRequest } from "next/server";

test("admin login locks a client after five wrong passwords; a correct one clears the count", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "bbe-login-"));
  const url = `file:${path.join(directory, "test.db")}`;
  const setup = createClient({ url });
  await setup.execute('CREATE TABLE "RateLimit" ("key" TEXT NOT NULL PRIMARY KEY, "attempts" INTEGER NOT NULL, "resetAt" BIGINT NOT NULL)');
  setup.close();
  Object.assign(process.env, { TURSO_DATABASE_URL: url, ADMIN_PASSWORD: "synthetic-test-password", VERCEL: "1" });
  // Imported after the environment is set: the Prisma client reads it on load.
  const { POST } = await import("../app/api/admin/auth/route");
  const login = async (ip: string, password: string) => POST(new NextRequest("http://localhost/api/admin/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-vercel-forwarded-for": ip },
    body: JSON.stringify({ password }),
  }));
  const statuses = async (ip: string, password: string, times: number) => {
    const result: number[] = [];
    for (let i = 0; i < times; i++) result.push((await login(ip, password)).status);
    return result;
  };
  try {
    // Five wrong passwords, then even the right one is refused.
    assert.deepEqual(await statuses("203.0.113.1", "wrong", 5), [401, 401, 401, 401, 401]);
    const locked = await login("203.0.113.1", "synthetic-test-password");
    assert.equal(locked.status, 429);
    assert.ok(Number(locked.headers.get("Retry-After")) > 0);

    // A correct password wipes earlier mistakes, so five more wrong ones are answered.
    assert.deepEqual(await statuses("203.0.113.2", "wrong", 4), [401, 401, 401, 401]);
    assert.equal((await login("203.0.113.2", "synthetic-test-password")).status, 200);
    assert.deepEqual(await statuses("203.0.113.2", "wrong", 5), [401, 401, 401, 401, 401]);
    assert.equal((await login("203.0.113.2", "synthetic-test-password")).status, 429);

    // Another client's sign-in does not lift the first client's lockout.
    assert.equal((await login("203.0.113.3", "synthetic-test-password")).status, 200);
    assert.equal((await login("203.0.113.1", "synthetic-test-password")).status, 429);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});
