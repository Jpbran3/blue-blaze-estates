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
npm install
cp .env.example .env.local   # fill in real values
npx prisma migrate deploy
npm run db:seed              # seeds Blue Blaze Mobile Home Park + a sample unit
npm run dev                  # http://localhost:3000
```

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

## Branding
Name: **Blue Blaze Estates** · Colors: blue (`blue-900`) & white · Logo: BB + house badge (inline SVG in Header/Footer, standalone at `public/logo.svg`). Contact: 618-942-7624 · blueblazeestates@gmail.com.
