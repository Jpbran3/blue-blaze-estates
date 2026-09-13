# Blue Blaze Estates

Rental listing + application portal for **Blue Blaze Estates** (Herrin, IL) — Blue Blaze Mobile Home Park and future communities. Tenants browse available units and submit a full rental application; the owner reviews and manages everything from an admin dashboard with AI-assisted tenant screening.

Built on the same platform as rjlurentals.com (Next.js + Prisma/Turso + Vercel).

## Stack
- **Next.js 16** (App Router) + **React 19**
- **Prisma 7** → **Turso** (libSQL / SQLite)
- **Vercel Blob** for listing image uploads
- **Anthropic API** for AI tenant screening (`lib/screenTenant.ts`)
- **Tailwind CSS v4**

## Local setup
```bash
npm ci
cp .env.example .env.local   # fill in real values
npm run dev                  # http://localhost:3000
```

Use Node.js 22.12 or later in the Node 22 release line (CI uses Node 22).
Next.js reads `.env.local`; standalone database scripts do not automatically
read that file. Supply their environment explicitly. Never point local setup
or seed commands at a production database.

For a fresh, disposable local database:
```bash
touch /tmp/blue-blaze-local.db
TURSO_DATABASE_URL=file:/tmp/blue-blaze-local.db npx prisma db push
TURSO_DATABASE_URL=file:/tmp/blue-blaze-local.db TURSO_AUTH_TOKEN= npm run dev
```

The historical migrations do not reproduce the full current schema. Do not use
`prisma migrate deploy` as the complete setup recipe or `db push` against an
existing production database. The additive compliance preparation script is
`npm run db:prepare-compliance`; production schema changes require a separately
reviewed migration. Seeding is optional and writes sample records.

## Verification

`npm test`, `npm run lint`, `npm audit`, and `npm run build` check the project.
GitHub Actions runs these checks for pull requests and pushes to `main`, using
a disposable database and no production credentials.

## Environment variables (`.env.local`)
| Key | Purpose |
|-----|---------|
| `TURSO_DATABASE_URL` | Turso database URL |
| `TURSO_AUTH_TOKEN` | Turso auth token |
| `ANTHROPIC_API_KEY` | AI tenant screening |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob image uploads |
| `ADMIN_PASSWORD` | Admin dashboard login |

## Key paths
- `app/page.tsx` — homepage (hero, property groups, CTA)
- `app/apply/page.tsx` — rental application form
- `app/cities/[citySlug]/page.tsx` — units within a property group
- `app/admin/page.tsx` — owner dashboard (review applications, manage listings)
- `lib/screenTenant.ts` — AI screening rules (felony, rent-to-income, etc.)
- `prisma/seed.ts` — initial property group + sample listing
- `app/privacy-policy`, `app/terms-and-conditions`, `app/accessibility` — legal pages (linked from the footer)
- `lib/adminAuth.ts` — shared admin auth; fails closed when `ADMIN_PASSWORD` is unset
- `next.config.ts` — security headers (CSP, X-Frame-Options, Referrer-Policy, …)

## Compliance notes
- **SSNs and driver's licence numbers are not collected.** The `ssn`, `spouseSsn`, `driversLicense` and `spouseDriversLicense` columns are retained for legacy rows only — never write to them.
- **Household composition is never scored.** Familial status is protected under the Fair Housing Act; `lib/screenTenant.ts` withholds those fields from the model entirely.
- Purge legacy SSN / driver's-licence / children data with `npm run db:purge-sensitive -- --dry-run`, then `-- --confirm`.

## Branding
Name: **Blue Blaze Estates** · Colors: blue (`blue-900`) & white · Logo: BB + house badge (inline SVG in Header/Footer, standalone at `public/logo.svg`). Contact: 618-942-7624 · blueblazeestates@gmail.com.
