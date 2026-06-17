import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

// TEMPORARY one-time route: creates the database tables on the production
// Turso database. Idempotent (CREATE TABLE IF NOT EXISTS), admin-only.
// Safe to remove once the tables exist.

async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  const adminPassword = (process.env.ADMIN_PASSWORD ?? "changeme").trim();
  return (
    session?.value ===
    crypto.createHash("sha256").update(adminPassword).digest("hex")
  );
}

const STATEMENTS: string[] = [
  `CREATE TABLE IF NOT EXISTS "City" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS "Listing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cityId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "rentPrice" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "images" TEXT,
    "status" TEXT NOT NULL DEFAULT 'available',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Listing_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "presentAddress" TEXT,
    "townStateZip" TEXT,
    "phone" TEXT NOT NULL,
    "ssn" TEXT,
    "driversLicense" TEXT,
    "birthDate" TEXT,
    "employer" TEXT,
    "employerAddress" TEXT,
    "employerTownStateZip" TEXT,
    "employerPhone" TEXT,
    "employmentDuration" TEXT,
    "monthlyWages" TEXT,
    "previousEmployer" TEXT,
    "spouseName" TEXT,
    "spouseDriversLicense" TEXT,
    "spouseBirthDate" TEXT,
    "spouseSsn" TEXT,
    "spouseEmployer" TEXT,
    "spouseEmployerAddress" TEXT,
    "spouseEmployerTownStateZip" TEXT,
    "spouseEmployerPhone" TEXT,
    "spouseEmploymentDuration" TEXT,
    "spouseMonthlyWages" TEXT,
    "spousePreviousEmployer" TEXT,
    "childrenResiding" TEXT,
    "adultsResiding" TEXT,
    "currentLandlord" TEXT,
    "currentLandlordPhone" TEXT,
    "currentTenancyDuration" TEXT,
    "currentRentAmount" TEXT,
    "previousLandlord" TEXT,
    "previousLandlordPhone" TEXT,
    "previousAddressRented" TEXT,
    "previousRentAmount" TEXT,
    "felonyHistory" TEXT,
    "interest" TEXT,
    "electronicSignature" TEXT,
    "signatureDate" TEXT,
    "email" TEXT,
    "listingId" TEXT,
    "rentPrice" REAL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "aiScore" INTEGER,
    "aiSummary" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Application_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE SET NULL ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "City_slug_key" ON "City"("slug")`,
];

// Safe view of TURSO_DATABASE_URL: reveals only the scheme/host shape so we can
// tell a remote Turso URL (libsql://...turso.io) apart from an ephemeral local
// one (file:..., :memory:). Never returns the auth token or full credentials.
function describeDbUrl() {
  const raw = process.env.TURSO_DATABASE_URL ?? "";
  const scheme = raw.includes("://") ? raw.split("://")[0] : raw.startsWith(":memory:") ? ":memory:" : "(none)";
  const isRemote = /^(libsql|https|wss|http|ws)$/i.test(scheme) && /turso\.io|\./.test(raw);
  const isEphemeral = scheme === "file" || raw.startsWith(":memory:") || raw === "" || scheme === "(none)";
  return {
    scheme,
    isRemote,
    isEphemeral,
    configured: raw.length > 0,
    authTokenPresent: !!process.env.TURSO_AUTH_TOKEN,
  };
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let tables: string[] = [];
  let queryError: string | null = null;
  try {
    const rows = await prisma.$queryRawUnsafe<{ name: string }[]>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    );
    tables = rows.map((t) => t.name);
  } catch (err) {
    queryError = err instanceof Error ? err.message : String(err);
  }
  return NextResponse.json({ db: describeDbUrl(), tables, queryError });
}

export async function POST() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    for (const stmt of STATEMENTS) {
      await prisma.$executeRawUnsafe(stmt);
    }
    const tables = await prisma.$queryRawUnsafe<{ name: string }[]>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    );
    return NextResponse.json({
      ok: true,
      db: describeDbUrl(),
      tables: tables.map((t) => t.name),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
