import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createSession, validSession, SESSION_SECONDS } from "../lib/session";
import { readJsonObject, RequestError } from "../lib/requestBody";
import { parseApplication } from "../lib/applicationInput";

test("sessions reject tampering, expiry, wrong password, and legacy hashes", () => {
  const now = Date.now();
  const token = createSession("synthetic-test-password", now);
  assert.equal(validSession(token, "synthetic-test-password", now), true);
  assert.equal(validSession(token, "changed-password", now), false);
  assert.equal(validSession(token + "x", "synthetic-test-password", now), false);
  assert.equal(validSession(token, "synthetic-test-password", now + SESSION_SECONDS * 1000), false);
  assert.equal(validSession("a".repeat(64), "synthetic-test-password", now), false);
  assert.notEqual(createSession("synthetic-test-password", now), token);
});

const valid = { applicantName: "Synthetic Test", phone: "618-555-0100", electronicSignature: "Synthetic Test" };
test("application allowlist discards SSN/licence/child data and internal screening fields", () => {
  const result = parseApplication({ ...valid, ssn: "synthetic", spouseSsn: "synthetic", driversLicense: "synthetic", spouseDriversLicense: "synthetic", childrenResiding: "synthetic", aiScore: 10, status: "approved", archived: true, manualReviewRequested: true });
  for (const key of ["ssn", "spouseSsn", "driversLicense", "spouseDriversLicense", "childrenResiding", "aiScore", "status", "archived"]) assert.equal(key in result, false);
  assert.equal(result.manualReviewRequested, true);
  assert.equal(result.listingId, null);
});

test("reject malformed, oversized, missing required fields and unsafe coercions", () => {
  for (const body of [{ ...valid, listingId: {} }, { ...valid, phone: [] }, { ...valid, applicantName: " " }, { ...valid, electronicSignature: "" }, { ...valid, employer: "x".repeat(2001) }, { ...valid, occupantCount: "-1" }, { ...valid, manualReviewRequested: "false" }]) {
    assert.throws(() => parseApplication(body), RequestError);
  }
  assert.equal(parseApplication(valid).manualReviewRequested, false);
});

test("JSON reader rejects arrays, null, invalid content types and malformed JSON", async () => {
  for (const body of ["null", "[]", '"text"', "{"]) {
    await assert.rejects(readJsonObject(new Request("http://localhost", { method: "POST", headers: { "Content-Type": "application/json" }, body })), RequestError);
  }
  await assert.rejects(readJsonObject(new Request("http://localhost", { method: "POST", body: "{}" })), { status: 415 });
  assert.deepEqual(await readJsonObject(new Request("http://localhost", { method: "POST", headers: { "Content-Type": "application/json" }, body: '{"ok":true}' })), { ok: true });
});

test("chunked JSON cannot evade the byte limit with missing Content-Length", async () => {
  const stream = new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode('"' + "x".repeat(200) + '"')); controller.close(); } });
  const request = new Request("http://localhost", { method: "POST", headers: { "Content-Type": "application/json" }, body: stream, duplex: "half" } as RequestInit);
  await assert.rejects(readJsonObject(request, 100), { status: 413 });
});

// Every link that leaves the site must carry rel="noopener noreferrer", so a
// target page can never reach back through window.opener or read the referrer.
// Applies whether or not the link opens in a new tab: target="_blank" may be
// added later, and the referrer leak does not depend on it.
test("external links in app/ and components/ set rel=\"noopener noreferrer\"", () => {
  const roots = ["app", "components"];
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== "generated") walk(full);
      } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
        files.push(full);
      }
    }
  };
  for (const root of roots) walk(path.join(process.cwd(), root));
  assert.ok(files.length > 0, "found no source files to scan");

  let checked = 0;
  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    for (const tag of source.match(/<a\s[^>]*>/g) ?? []) {
      const href = tag.match(/href=(?:"([^"]*)"|\{?`([^`]*)`\}?)/);
      const url = href?.[1] ?? href?.[2] ?? "";
      if (!/^https?:\/\//.test(url)) continue; // tel:, mailto: and internal paths
      checked++;
      const rel = tag.match(/rel="([^"]*)"/)?.[1] ?? "";
      const where = `${path.relative(process.cwd(), file)} -> ${url}`;
      assert.ok(rel.split(/\s+/).includes("noopener"), `missing rel=noopener: ${where}`);
      assert.ok(rel.split(/\s+/).includes("noreferrer"), `missing rel=noreferrer: ${where}`);
    }
  }
  // Guards the scanner itself: the two screening-provider privacy links in the
  // privacy policy must be found, or the regex has silently stopped matching.
  assert.ok(checked >= 2, `expected to check at least 2 external links, checked ${checked}`);
});
