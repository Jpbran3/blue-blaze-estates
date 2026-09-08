# Blue Blaze Estates — review of Claude's compliance work

Reviewed September 7, 2026 (America/Chicago). **Result: incomplete; not ready to describe as compliant.** This is a technical and content risk review against the supplied master prompt, not a legal opinion or a guarantee against lawsuits.

Reviewed the working tree in this folder, Claude's compliance commit `b8d292c`, its Next.js update `6e954c6`, the existing local server at `http://localhost:3100`, and the public site at `https://www.blueblazeestates.com`. No website code, business policies, deployment, application records, or screening decisions were changed in this review.

## 1. Most urgent: the public site does not have these changes

Direct browser inspection and HTTP checks showed:

| Check | Local preview | Public website |
|---|---|---|
| Privacy policy | 200, linked in footer | 404, no footer link |
| Terms and conditions | 200, linked in footer | 404, no footer link |
| Accessibility statement | 200, linked in footer | 404, no footer link |
| Application SSN field | Removed | Still displayed |
| Children's names/ages field | Replaced by occupant count | Still displayed |
| AI review/privacy disclosure on application | Present | Absent |
| Homepage skip link | Present and keyboard-tested | Absent |
| CSP, frame protection, nosniff, referrer headers | Present | Absent on checked public homepage/legal responses |
| HSTS | Present | Present |

The live application was viewed without entering or submitting any applicant data. Its existing disclosure authorizes credit-information disclosure but does not provide the new AI-review/privacy explanation. Local files alone do not establish what code is running on the production server.

**Next step:** finish the remaining local issues, verify the correct deployment target, and check the public pages again after deployment. Publishing the current legal drafts unchanged would expose their unfinished placeholders.

## 2. What Claude completed locally

- Created real privacy, terms, and accessibility routes and footer links.
- Removed SSN/spouse-SSN collection and API writes. Removed children's names/ages collection in favor of occupant count.
- Removed explicit household-count/other-adult/children fields from the AI payload and added advisory/human-review language.
- Replaced missing-password fallback behavior with shared authentication that fails closed.
- Added standard security headers. Unauthenticated HEAD requests to application-list and admin-auth endpoints returned 401 locally and publicly.
- Added main landmarks/skip navigation and strengthened application input borders and required/error text colors. The four existing uncommitted changes make public-page main landmarks programmatically focusable.
- Added a legacy-data purge utility; its existence does **not** establish that legacy data was purged.
- Updated Next.js to 16.3.4. Other dependency findings remain below.

## 3. Remaining substantive findings

### High priority — screening criteria need an Illinois housing attorney

`lib/screenTenant.ts:69–100` calculates income from applicant/spouse wages, penalizes missing wages, favors having an employer, and sets the final score to 1 for any reported felony. It gives no offense-specific recency/relevance assessment before assigning that score. Human-review wording does not remove these rules. The comments say the felony rule reflects an earlier owner decision; this review did not change that decision.

The wage/employment rules may disadvantage applicants using other lawful income sources. This is a concrete concern because Illinois protects source of income, marital status, disability, and familial status, among other characteristics, in housing. See [Illinois Department of Human Rights housing rights](https://dhr.illinois.gov/rights/housing-rights.html). This is a risk finding requiring legal review, not a determination that a particular applicant was discriminated against. No real applicants were evaluated during this audit.

### High priority — privacy text contradicts the AI payload

`app/privacy-policy/page.tsx` says the score is based only on employment, income, rental history, and rent, and that household identities are excluded. `lib/screenTenant.ts:122–162` also sends applicant identity/contact/address, spouse name, criminal history, and free-text notes. The model's criminal-history rule directly affects the score.

The policy offers review without the automated tool, but `app/api/applications/route.ts` attempts AI screening on every saved application, and admin content edits trigger another screening. There is no persisted opt-out flag or form choice. A separate manual intake could fulfill the promise only if the owner actually operates it; that was not established.

Resolve the payload, disclosure, and manual-review workflow together. The statements about provider training practices, data retention, database security, and operational response commitments also need verification against actual contracts/settings/practices.

### Medium priority — accessibility is improved, not finished

- **Carousel:** advances every five seconds with no pause/stop control. Reduced-motion support alone is not an on-page pause mechanism. See [W3C Pause, Stop, Hide](https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html).
- **Placeholder contrast:** approximately **2.63:1**, below the 4.5:1 normal-text target. This includes address, phone, wages, and signature hints. Existing `public/__audit.js` checks text nodes but misses CSS placeholder text, explaining how this can escape that audit.
- **Gallery:** source review shows Escape/arrow-key handlers and dialog semantics, but no initial focus transfer, focus containment, or restoration to the opener. Neither preview supplied a usable gallery for a runtime test: local listings were empty; the public listing had no photo. Flag is based on code, not a claimed completed gallery interaction test.
- **Admin:** login label exists, but many editor labels are siblings without matching `htmlFor`/input IDs; borders still use low-contrast gray-300. The global skip link has no `main-content` destination in the admin page. Authenticated editor screens were reviewed in source, not by accessing applicant records.
- **Form errors:** error text is visually displayed outside the wrapping label without explicit `aria-describedby`/`aria-invalid` wiring. Review error announcements and focus after failed validation.
- **Reflow:** application and privacy pages fit at 390 CSS pixels. Terms and accessibility pages produced a 323-pixel document at a 320-pixel viewport (slight horizontal overflow). Accessibility page fit at 526 pixels. These are responsive-width checks, **not** a completed true 200% browser-zoom test; the browser interface did not provide a verified zoom control.
- The accessibility statement's blanket keyboard/contrast/zoom claims are stronger than the evidence. It appropriately names some outstanding assistive-technology work, but needs to reflect the actual remaining defects.

### Medium priority — legal drafts and unsupported business claims

The terms' dispute section is marked for counsel but still invents a default Williamson County court venue. The master prompt specifically asks for a review placeholder instead of definitive dispute terms. The terms also assert ownership/permission for all assets without a license record in the reviewed project.

Claims needing owner evidence: “within one business day” (homepage/application), “no hidden fees,” “no application fee,” property condition/readiness, the phone/email, actual legal entity, and mailing address. Repetition across pages establishes consistency, not truth. No testimonial/review section or testimonial dataset was found in the reviewed site code or visited public pages.

### Security follow-up

- Local CSP is delivered, but `script-src` allows `unsafe-inline`; do not call it a strict nonce/hash-based CSP. The config comment incorrectly implies that inline scripts are not allowed.
- The public submission endpoint returns the entire created application (and sometimes AI score/summary) rather than a minimal receipt. This unnecessarily exposes internal screening output to the submitting browser; it does not by itself expose other applicants.
- Error handlers still log raw database/provider errors. These can contain personal data or request details. Removing successful-summary logs did not establish that all failure logs are minimized.
- Runtime payload validation is incomplete: casting request JSON to TypeScript types does not reject null/arrays/non-string values. For example, non-string `listingId` reaches `.trim()`. Validate inputs before use and bound request/field sizes.
- Admin cookie is a deterministic password hash with no server-enforced expiry. The seven-day cookie lifetime is browser-side. Application-level login/submission throttling was not found; hosting firewall/rate-limit configuration was not inspected.
- Sensitive configuration is referenced in server-side files; no `NEXT_PUBLIC` secret use was found in those reviewed sources. A comparison against actual secret values could not run because no usable local secret values were available. Production-bundle secrecy is therefore **not certified**.
- No email/SMS notification sender was found in the application flow; it saves to Turso and calls Anthropic. External notifications or marketing tools configured outside this repository remain unverified.

## 4. Visual and contrast evidence

Viewed screenshots of the local homepage, application, privacy, terms, accessibility, and admin login; also the public homepage, application, and Herrin listing. Checked application spouse disclosure expansion and mobile navigation. Keyboard Tab reached the homepage skip link; Enter moved focus to the main landmark.

Measured rendered CSS colors, converted Lab/OKLab to sRGB, applied alpha compositing for placeholders, and calculated WCAG relative-luminance ratios. Examples from the local application:

| Pair | Ratio | Result |
|---|---:|---|
| Label text / white | 10.31:1 | Pass |
| Secondary introduction text / white | 4.84:1 | Pass |
| Required asterisk / white | 6.42:1 | Pass |
| Input border / white | 4.84:1 | Pass, 3:1 control target |
| Submit text / blue button | 10.40:1 | Pass |
| Footer section headings / blue | 5.74:1 | Pass |
| Placeholder text / white | 2.63:1 | Fail |

This is sampled measured coverage, not a claim that every dynamic, hover, focus, error, gallery, or authenticated-admin pairing passed. Screenshots alone cannot establish WCAG conformance. Also, correct the reusable guide's large-text conversion: 18pt equals 24 CSS pixels; 14pt bold is approximately 18.67 CSS pixels, not 18px/14px.

## 5. Scripts, cookies, and assets

| Item | Finding |
|---|---|
| Next.js/React and application scripts | First-party `/_next/static/chunks/*`, Turbopack runtime chunk, inline hydration/bootstrap scripts observed locally |
| Ad pixels / analytics / chat / embeds | No integrations found in reviewed app source; no third-party script URLs in inspected local application DOM |
| Fonts | Inter and Playfair Display via `next/font/google`; observed browser font files served locally from `/_next/static/media/*.woff2`. Preserve upstream license records; no asset-license manifest was provided |
| Vercel | Hosting and Blob listing-image storage/upload, not an installed analytics tracker |
| Turso | Server-side application database |
| Anthropic | Server-side screening provider receiving the fields described above; not a browser pixel |
| Admin cookie | `admin_session`, HttpOnly, SameSite=Lax, Secure in production, seven-day Max-Age; calling it a session cookie without mentioning persistence is imprecise |
| Property photos | `park-1.jpg`, `park-2.jpg`, `park-3.jpg`, `blue-blaze-mobile-home-park.jpg`; local files alone do not prove ownership, permission, authenticity, or accurate location |
| Logos/icons | Inline SVG house/BB branding, standalone logo and generated favicons; decorative template SVGs also exist. No provenance/license ledger found |
| PDFs | No linked/downloadable PDF or form file found in reviewed public assets/source; no PDF accessibility certification needed for a nonexistent file |
| AI authenticity disclosures | No evidence sufficient to classify property photos as AI-generated or authentic. No fake testimonial was identified. Owner must confirm asset provenance rather than adding speculative disclosures |

No separate cookie/refund page was added. That is consistent with the reviewed absence of non-essential tracking and payments/bookings in this code. It does not establish that the business has no external payment, booking, or marketing services. Do not add a cookie banner merely to appear compliant.

## 6. Every remaining marked owner/attorney item

| Location | Outstanding information |
|---|---|
| Privacy introduction | Exact legal entity |
| Privacy retention section | Actual retention/deletion policy; remove unsupported blanket retention-law advice |
| Privacy contact section | Mailing address |
| Terms introduction | Exact legal entity |
| Terms disputes section | Attorney-approved dispute language; remove unapproved venue wording |
| Accessibility response section | Actual response timeframe and operational alternative intake |
| Screening source comment | Owner sign-off on felony policy; legal review remains necessary beyond sign-off |

Attorney review should also cover income/voucher treatment, criminal-history screening, household/spouse data, AI review/opt-out and any consumer-report obligations if applicable, privacy rights/retention/breach language, electronic-signature/application authorization, limitations of liability, governing law and disputes, and housing accommodation statements. Owner verification is needed for fees, contact details, asset permissions, provider settings, and service-response claims.

The master prompt is an internal checklist, not a statement of universally applicable law. In particular, public-website ADA treatment, cookie consent, and AI disclosures depend on facts and jurisdiction. [DOJ's web accessibility guidance](https://www.ada.gov/resources/web-guidance/) supports accessible implementation; it does not certify this private business or make a disclaimer a defense.

## 7. Verification and limits

- `npx tsc --noEmit`: passed.
- `npm run lint`: three errors and one warning in the pre-existing tree (admin React effect checks plus other lint findings); not a legal compliance test.
- `npm audit`: 24 affected packages: **15 high, 7 moderate, 2 low, 0 critical**. These include transitive/development tooling and are not 15 proven exploitable public endpoints. Some suggested fixes cross major versions or downgrade Prisma; do not run a blind forced fix.
- No rebuild, deploy, migration, data purge, login brute force, exploit attempt, application submission, or paid AI screening was performed.
- Local homepage had no city records; public Herrin listing existed but had no photo. This limited interactive gallery testing.
- No full screen-reader audit, actual 200% browser zoom verification, authenticated admin walkthrough, production secret review, asset-license verification, or owner-policy confirmation was completed. Those remain explicit limits.

Recommended order: resolve screening/privacy contradictions and draft facts, fix accessibility/security findings, verify dependencies and application behavior, then deploy and repeat the public-site checks. Do not treat the presence of legal pages as completion of this work.

## Appendix: dependency audit package summary

| Package | Severity |
|---|---|
| @hono/node-server | high |
| @prisma/config | high |
| @prisma/dev | high |
| brace-expansion | high |
| browserslist | high |
| deepmerge-ts | high |
| defu | high |
| effect | high |
| hono | high |
| js-yaml | high |
| lodash | high |
| mysql2 | high |
| prisma | high |
| undici | high |
| ws | high |
| @babel/core | low |
| esbuild | low |
| @anthropic-ai/sdk | moderate |
| @chevrotain/cst-dts-gen | moderate |
| @chevrotain/gast | moderate |
| @humanfs/node | moderate |
| @mrleebo/prisma-ast | moderate |
| chevrotain | moderate |
| valibot | moderate |

## Appendix: Claude compliance commit file inventory

- `README.md`
- `app/accessibility/page.tsx`
- `app/admin/page.tsx`
- `app/api/admin/auth/route.ts`
- `app/api/applications/[id]/route.ts`
- `app/api/applications/route.ts`
- `app/api/cities/[id]/route.ts`
- `app/api/cities/route.ts`
- `app/api/listings/[id]/route.ts`
- `app/api/listings/route.ts`
- `app/api/upload/route.ts`
- `app/apply/page.tsx`
- `app/cities/[citySlug]/page.tsx`
- `app/layout.tsx`
- `app/page.tsx`
- `app/privacy-policy/page.tsx`
- `app/terms-and-conditions/page.tsx`
- `components/Footer.tsx`
- `components/LegalPage.tsx`
- `lib/adminAuth.ts`
- `lib/screenTenant.ts`
- `next.config.ts`
- `package.json`
- `prisma/migrations/20260907000000_add_occupant_count/migration.sql`
- `prisma/purge-ssn.ts`
- `prisma/schema.prisma`

Subsequent Next.js bump: `package.json` and `package-lock.json` (commit `6e954c6`). At review start, existing uncommitted changes were in `app/apply/page.tsx`, `app/cities/[citySlug]/page.tsx`, `app/page.tsx`, and `components/LegalPage.tsx`; `public/__audit.js` was untracked. This review added only `COMPLIANCE-REVIEW.md`.
