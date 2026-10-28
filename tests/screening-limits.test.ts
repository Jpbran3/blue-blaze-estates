import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { claimScreeningSlot, envLimit, submitLimitPerHour } from "../lib/screeningLimits";

/**
 * The screening call is paid and triggered by an unauthenticated form, so its
 * ceiling must hold even when the counter store fails. These use a fake counter
 * and never touch a database or the Anthropic API.
 */

function withEnv(values: Record<string, string | undefined>, run: () => Promise<void> | void) {
  const previous = Object.fromEntries(Object.keys(values).map((k) => [k, process.env[k]]));
  Object.assign(process.env, values);
  for (const [k, v] of Object.entries(values)) if (v === undefined) delete process.env[k];
  return Promise.resolve(run()).finally(() => {
    for (const [k, v] of Object.entries(previous)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  });
}

test("daily screening cap uses one global counter and the configured limit", () =>
  withEnv({ SCREENING_DAILY_CAP: "2" }, async () => {
    const counts = new Map<string, number>();
    const fake = async (name: string, limit: number, windowSeconds: number) => {
      assert.equal(windowSeconds, 86400);
      const n = (counts.get(name) ?? 0) + 1;
      counts.set(name, n);
      return { allowed: n <= limit, retryAfter: 1 };
    };
    assert.deepEqual([await claimScreeningSlot(fake), await claimScreeningSlot(fake), await claimScreeningSlot(fake)], [true, true, false]);
    assert.deepEqual([...counts.keys()], ["screening:daily"]);
  }));

test("screening cap fails closed when the counter store is down", async () => {
  const original = console.error;
  console.error = () => {};
  try {
    assert.equal(await claimScreeningSlot(async () => { throw new Error("db down"); }), false);
  } finally {
    console.error = original;
  }
});

test("limits fall back to defaults when unset or invalid", () =>
  withEnv({ SCREENING_DAILY_CAP: "abc", APPLICATION_SUBMIT_LIMIT_PER_HOUR: undefined }, () => {
    assert.equal(envLimit("SCREENING_DAILY_CAP", 200), 200);
    assert.equal(submitLimitPerHour(), 10);
  }));

test("screening module is server-only and checks the cap before calling the model", () => {
  const source = fs.readFileSync(path.join(process.cwd(), "lib/screenTenant.ts"), "utf8");
  assert.match(source, /^\/\/.*\nimport "server-only";/);
  assert.ok(source.indexOf("claimScreeningSlot()") < source.indexOf("client.messages.create"));
});
