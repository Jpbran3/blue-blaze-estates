# Technical maintenance verification — September 13, 2026

## Changes

- Updated Prisma, its generated-client package and libSQL adapter together from 7.5.0 to 7.10.0; refreshed vulnerable transitive dependencies without a forced major upgrade.
- Corrected the privacy policy's stale reference to indefinite application retention and synchronized internal notes with already recorded decisions.
- Moved the dispute-section drafting flag into a source comment, preserving the public statement that no dispute-resolution terms are in effect and no rights are limited.
- Corrected local setup instructions: historical migrations do not reconstruct the current schema. Included the empty environment template and corrected a stale purge-command reference.
- Added GitHub Actions checks for clean installation, lint, tests, high/critical dependency audit and production build against a disposable database.

## Verification

- Clean `npm ci` generated Prisma Client 7.10.0 successfully.
- `npm audit`: zero reported vulnerabilities, including development dependencies, at verification time.
- All 19 existing tests and ESLint passed; optimized Next.js build passed after regeneration.
- Used a disposable SQLite database created from the current schema. A local HTTP application submission succeeded and its stored values were checked: manual review remained enabled, AI score remained empty, and an empty listing selection became null. The synthetic record was removed afterward. Production data was not modified.
- Browser checks of `/`, `/apply`, `/privacy-policy`, `/terms-and-conditions`, `/accessibility` and the signed-out `/admin` page: axe-core WCAG 2 A/AA and WCAG 2.1 AA automated scans reported no violations. All fit a 320px viewport without horizontal overflow. Inspected application screenshots at desktop and mobile widths.

Automated accessibility checks are not a complete accessibility audit. Actual VoiceOver/NVDA operation, native browser zoom and authenticated admin workflows with representative fixtures still need dedicated manual testing. The public accessibility statement continues to disclose those limits.

## Owner-dependent work left untouched

Screening criteria, provider/account details, notices, and report-retention choices remain as recorded in the owner documentation. No automatic applicant deletion was added: handling unassigned applications, tenancy records and legal holds requires a confirmed policy. Archiving is not deletion. The existing admin delete action can be used under an owner-approved procedure.
