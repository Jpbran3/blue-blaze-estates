import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

/**
 * These guard the fair-housing and privacy properties of the screening payload.
 *
 * The privacy policy tells applicants exactly which fields reach the model. If
 * someone adds a field to buildUserMessage without updating that page, the
 * policy silently becomes a misrepresentation — which is what these assert
 * against. They read the source rather than calling the API so they run with no
 * API key and send no applicant data anywhere.
 */

const source = fs.readFileSync(
  path.join(process.cwd(), "lib/screenTenant.ts"),
  "utf8"
);
const payload = source.slice(
  source.indexOf("const fields:"),
  source.indexOf("];", source.indexOf("const fields:"))
);

test("identity and contact data never reach the screening model", () => {
  // Names, addresses and contact details are what a model could use to infer
  // race, national origin or familial status.
  for (const banned of [
    "app.applicantName",
    "app.presentAddress",
    "app.townStateZip",
    "app.phone",
    "app.email",
    "app.spouseName",
  ]) {
    assert.equal(
      payload.includes(banned),
      false,
      `${banned} must not be sent to the screening model`
    );
  }
});

test("household composition never reaches the screening model", () => {
  // Familial status is a protected class under the FHA and the IHRA.
  for (const banned of [
    "app.childrenResiding",
    "app.occupantCount",
    "app.adultsResiding",
  ]) {
    assert.equal(payload.includes(banned), false, `${banned} must not be sent`);
  }
});

test("free-text notes never reach the screening model", () => {
  // Applicant-authored prose can volunteer protected characteristics.
  assert.equal(payload.includes("app.interest"), false);
});

test("third-party landlord identities are reduced to yes/no flags", () => {
  // [\s\S] rather than the /s flag: the project's TS target predates es2018.
  assert.match(payload, /Current Landlord Provided[\s\S]*app\.currentLandlord \?/);
  assert.equal(
    /\["Current Landlord",\s*app\.currentLandlord\]/.test(payload),
    false,
    "landlord name must not be sent verbatim"
  );
});

test("the fields that scoring rules need are still sent", () => {
  for (const required of [
    "app.employer",
    "app.monthlyWages",
    "app.employmentDuration",
    "app.currentTenancyDuration",
    "app.felonyHistory",
  ]) {
    assert.equal(payload.includes(required), true, `${required} must be sent`);
  }
});

test("screening criteria and thresholds are unchanged", () => {
  // The owner asked for the substantive rules to be preserved exactly.
  assert.match(source, /ratio > 0\.33/); // rent-to-income threshold
  assert.match(source, /deduct 3-4 points/); // over-threshold penalty
  assert.match(source, /deduct 2 points/); // undisclosed-income penalty
  assert.match(source, /set the final score to 1/); // felony outcome
  assert.match(source, /roughly 55% of base score/); // employment weight
  assert.match(source, /roughly 45% of base score/); // rental-history weight
});

test("household composition carries no scoring weight in the prompt", () => {
  // Scope to the prompt the model actually receives. The surrounding comments
  // legitimately mention these terms to explain why they are excluded.
  const prompt = source.slice(
    source.indexOf("const SYSTEM_PROMPT"),
    source.indexOf("function buildUserMessage")
  );
  assert.equal(/HOUSEHOLD COMPOSITION/.test(prompt), false);
  assert.equal(/unrelated adults/.test(prompt), false);
  // The prohibition itself must still be present in the prompt.
  assert.match(prompt, /unlawful housing discrimination/);
  assert.match(prompt, /familial status/);
});

test("the submission route skips screening when manual review is requested", () => {
  const route = fs.readFileSync(
    path.join(process.cwd(), "app/api/applications/route.ts"),
    "utf8"
  );
  assert.match(route, /if \(!manualReviewRequested\) \{/);
  // and the receipt must not leak the internal assessment
  assert.equal(/aiScore/.test(route.slice(route.indexOf("Minimal receipt"))), false);
});

test("admin edits do not re-screen a manual-review application", () => {
  const route = fs.readFileSync(
    path.join(process.cwd(), "app/api/applications/[id]/route.ts"),
    "utf8"
  );
  assert.match(route, /hasContentChanges && !application\.manualReviewRequested/);
});

test("SSN, driver's licence and children fields are never written by the API", () => {
  const route = fs.readFileSync(
    path.join(process.cwd(), "app/api/applications/route.ts"),
    "utf8"
  );
  for (const banned of [
    "ssn:",
    "spouseSsn:",
    "driversLicense:",
    "spouseDriversLicense:",
    "childrenResiding:",
  ]) {
    assert.equal(route.includes(banned), false, `${banned} must not be written`);
  }
});

test("the public form does not collect SSN or driver's licence", () => {
  const form = fs.readFileSync(
    path.join(process.cwd(), "app/apply/page.tsx"),
    "utf8"
  );
  for (const banned of [
    "ssn",
    "spouseSsn",
    "driversLicense",
    "spouseDriversLicense",
  ]) {
    assert.equal(
      new RegExp(`\\b${banned}\\b`).test(form),
      false,
      `${banned} must not appear in the application form`
    );
  }
});

test("the admin dashboard does not display SSN or driver's licence", () => {
  const admin = fs.readFileSync(
    path.join(process.cwd(), "app/admin/page.tsx"),
    "utf8"
  );
  for (const banned of ["driversLicense", "spouseDriversLicense", "spouseSsn"]) {
    assert.equal(admin.includes(banned), false, `${banned} must not be displayed`);
  }
});
