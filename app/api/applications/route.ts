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

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { applicantName, phone, listingId } = body;

  if (!applicantName || !phone) {
    return NextResponse.json(
      { error: "applicantName and phone are required" },
      { status: 400 }
    );
  }

  const listing = listingId
    ? await prisma.listing.findUnique({ where: { id: listingId } })
    : null;
  const rentPrice = listing?.rentPrice ?? null;

  const application = await prisma.application.create({
    data: {
      applicantName,
      phone,
      listingId: listingId ?? null,
      rentPrice,
      presentAddress: body.presentAddress ?? null,
      townStateZip: body.townStateZip ?? null,
      ssn: body.ssn ?? null,
      driversLicense: body.driversLicense ?? null,
      birthDate: body.birthDate ?? null,
      employer: body.employer ?? null,
      employerAddress: body.employerAddress ?? null,
      employerTownStateZip: body.employerTownStateZip ?? null,
      employerPhone: body.employerPhone ?? null,
      employmentDuration: body.employmentDuration ?? null,
      monthlyWages: body.monthlyWages ?? null,
      previousEmployer: body.previousEmployer ?? null,
      spouseName: body.spouseName ?? null,
      spouseDriversLicense: body.spouseDriversLicense ?? null,
      spouseBirthDate: body.spouseBirthDate ?? null,
      spouseSsn: body.spouseSsn ?? null,
      spouseEmployer: body.spouseEmployer ?? null,
      spouseEmployerAddress: body.spouseEmployerAddress ?? null,
      spouseEmployerTownStateZip: body.spouseEmployerTownStateZip ?? null,
      spouseEmployerPhone: body.spouseEmployerPhone ?? null,
      spouseEmploymentDuration: body.spouseEmploymentDuration ?? null,
      spouseMonthlyWages: body.spouseMonthlyWages ?? null,
      spousePreviousEmployer: body.spousePreviousEmployer ?? null,
      childrenResiding: body.childrenResiding ?? null,
      adultsResiding: body.adultsResiding ?? null,
      currentLandlord: body.currentLandlord ?? null,
      currentLandlordPhone: body.currentLandlordPhone ?? null,
      currentTenancyDuration: body.currentTenancyDuration ?? null,
      currentRentAmount: body.currentRentAmount ?? null,
      previousLandlord: body.previousLandlord ?? null,
      previousLandlordPhone: body.previousLandlordPhone ?? null,
      previousAddressRented: body.previousAddressRented ?? null,
      previousRentAmount: body.previousRentAmount ?? null,
      felonyHistory: body.felonyHistory ?? null,
      interest: body.interest ?? null,
      electronicSignature: body.electronicSignature ?? null,
      signatureDate: body.signatureDate ?? null,
    },
  });

  const result = await screenTenant(application, rentPrice);

  console.log("Screening result:", JSON.stringify(result));

  if (result.score > 0) {
    const updated = await prisma.application.update({
      where: { id: application.id },
      data: { aiScore: result.score, aiSummary: result.summary },
    });
    return NextResponse.json(updated, { status: 201 });
  }

  // Score 0 means API error — return the application without a score rather than saving 0
  console.error("Screening returned error score for new application:", result.summary);
  return NextResponse.json(application, { status: 201 });
}
