import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { screenTenant } from "@/lib/screenTenant";

export const maxDuration = 60;

async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  const adminPassword = (process.env.ADMIN_PASSWORD ?? "changeme").trim();
  return (
    session?.value ===
    crypto.createHash("sha256").update(adminPassword).digest("hex")
  );
}

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const archived = searchParams.get("archived") === "true";

  const applications = await prisma.application.findMany({
    where: { archived },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(applications);
}

// Transient libSQL/Turso errors (a reused HTTP connection can go stale between
// serverless invocations). Retrying the same op once almost always succeeds.
const RETRYABLE_DB_ERROR =
  /stream not found|connection|timed? ?out|reset|ECONN|closed|unavailable|hyper|broken pipe|EPIPE/i;

async function withDbRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (RETRYABLE_DB_ERROR.test(msg)) {
      console.error(`${label} hit a transient DB error — retrying once:`, msg);
      await new Promise((r) => setTimeout(r, 300));
      return await fn();
    }
    throw err;
  }
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const applicantName = body.applicantName as string | undefined;
  const phone = body.phone as string | undefined;

  // Normalize listingId: the form sends "" when no unit is selected. An empty
  // string (or any id that doesn't match a real listing) would violate the
  // Listing foreign key and make the insert fail, so coerce those to null.
  const rawListingId = (body.listingId as string | null | undefined) ?? null;
  let listingId: string | null =
    rawListingId && rawListingId.trim() !== "" ? rawListingId.trim() : null;

  if (!applicantName || !phone) {
    return NextResponse.json(
      { error: "applicantName and phone are required" },
      { status: 400 }
    );
  }

  // Look up the unit's rent for screening, and verify the listing actually
  // exists — if it doesn't, drop the link rather than fail the foreign key.
  let rentPrice: number | null = null;
  if (listingId) {
    const lookupId = listingId;
    try {
      const listing = await withDbRetry(
        () => prisma.listing.findUnique({ where: { id: lookupId } }),
        "listing lookup"
      );
      if (listing) {
        rentPrice = listing.rentPrice ?? null;
      } else {
        listingId = null; // referenced unit no longer exists
      }
    } catch (err) {
      console.error("Listing lookup failed (saving without listing link):", err);
      listingId = null;
    }
  }

  const str = (key: string) => (body[key] as string | undefined) ?? null;

  // 1) Save the application. This is the only step allowed to fail the request.
  let application;
  try {
    application = await withDbRetry(
      () =>
        prisma.application.create({
          data: {
            applicantName,
            phone,
            listingId,
            rentPrice,
            presentAddress: str("presentAddress"),
            townStateZip: str("townStateZip"),
            ssn: str("ssn"),
            driversLicense: str("driversLicense"),
            birthDate: str("birthDate"),
            employer: str("employer"),
            employerAddress: str("employerAddress"),
            employerTownStateZip: str("employerTownStateZip"),
            employerPhone: str("employerPhone"),
            employmentDuration: str("employmentDuration"),
            monthlyWages: str("monthlyWages"),
            previousEmployer: str("previousEmployer"),
            spouseName: str("spouseName"),
            spouseDriversLicense: str("spouseDriversLicense"),
            spouseBirthDate: str("spouseBirthDate"),
            spouseSsn: str("spouseSsn"),
            spouseEmployer: str("spouseEmployer"),
            spouseEmployerAddress: str("spouseEmployerAddress"),
            spouseEmployerTownStateZip: str("spouseEmployerTownStateZip"),
            spouseEmployerPhone: str("spouseEmployerPhone"),
            spouseEmploymentDuration: str("spouseEmploymentDuration"),
            spouseMonthlyWages: str("spouseMonthlyWages"),
            spousePreviousEmployer: str("spousePreviousEmployer"),
            childrenResiding: str("childrenResiding"),
            adultsResiding: str("adultsResiding"),
            currentLandlord: str("currentLandlord"),
            currentLandlordPhone: str("currentLandlordPhone"),
            currentTenancyDuration: str("currentTenancyDuration"),
            currentRentAmount: str("currentRentAmount"),
            previousLandlord: str("previousLandlord"),
            previousLandlordPhone: str("previousLandlordPhone"),
            previousAddressRented: str("previousAddressRented"),
            previousRentAmount: str("previousRentAmount"),
            felonyHistory: str("felonyHistory"),
            interest: str("interest"),
            electronicSignature: str("electronicSignature"),
            signatureDate: str("signatureDate"),
          },
        }),
      "application create"
    );
  } catch (err) {
    console.error(
      "Application create failed:",
      err instanceof Error ? err.stack ?? err.message : err
    );
    return NextResponse.json(
      { error: "We couldn't save your application. Please try again." },
      { status: 503 }
    );
  }

  // 2) AI screening is best-effort. A saved application must NEVER be reported
  //    to the applicant as a failure just because screening/update hiccuped.
  try {
    const result = await screenTenant(application, rentPrice);
    if (result.score > 0) {
      const updated = await withDbRetry(
        () =>
          prisma.application.update({
            where: { id: application.id },
            data: { aiScore: result.score, aiSummary: result.summary },
          }),
        "application screening update"
      );
      return NextResponse.json(updated, { status: 201 });
    }
    console.error("Screening returned error score for new application:", result.summary);
  } catch (err) {
    console.error("Screening/update failed (application still saved):", err);
  }

  return NextResponse.json(application, { status: 201 });
}
