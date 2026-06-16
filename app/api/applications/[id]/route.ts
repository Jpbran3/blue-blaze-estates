import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { screenTenant } from "@/lib/screenTenant";

// Give the function more time on Vercel Pro/Teams (hobby stays at 10s)
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

const EDITABLE_FIELDS = [
  "applicantName",
  "phone",
  "email",
  "interest",
  "presentAddress",
  "townStateZip",
  "ssn",
  "driversLicense",
  "birthDate",
  "employer",
  "employerAddress",
  "employerTownStateZip",
  "employerPhone",
  "employmentDuration",
  "monthlyWages",
  "previousEmployer",
  "spouseName",
  "spouseDriversLicense",
  "spouseBirthDate",
  "spouseSsn",
  "spouseEmployer",
  "spouseEmployerAddress",
  "spouseEmployerTownStateZip",
  "spouseEmployerPhone",
  "spouseEmploymentDuration",
  "spouseMonthlyWages",
  "spousePreviousEmployer",
  "childrenResiding",
  "adultsResiding",
  "currentLandlord",
  "currentLandlordPhone",
  "currentTenancyDuration",
  "currentRentAmount",
  "previousLandlord",
  "previousLandlordPhone",
  "previousAddressRented",
  "previousRentAmount",
  "felonyHistory",
  "electronicSignature",
  "signatureDate",
] as const;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: Record<string, any> = {};

  if (body.status !== undefined) updateData.status = body.status;
  if (body.archived !== undefined) updateData.archived = body.archived;

  for (const field of EDITABLE_FIELDS) {
    if (field in body) {
      updateData[field] = body[field] || null;
    }
  }

  const application = await prisma.application.update({
    where: { id },
    data: updateData,
  });

  // Re-run AI screening whenever content fields are edited.
  // Always runs — status/archived-only updates don't contain any EDITABLE_FIELDS.
  const hasContentChanges = EDITABLE_FIELDS.some((f) => f in body);
  if (hasContentChanges) {
    const result = await screenTenant(application, application.rentPrice);

    // Only write the new score if the AI call actually succeeded (score > 0).
    // score == 0 means the API returned an error — preserve the existing score
    // so the admin doesn't see their real score disappear.
    if (result.score > 0) {
      const rescreened = await prisma.application.update({
        where: { id },
        data: { aiScore: result.score, aiSummary: result.summary },
      });
      return NextResponse.json(rescreened);
    }

    // Screening failed — return the saved field changes but keep old score intact
    console.error("Re-screening returned error score after admin edit:", result.summary);
  }

  return NextResponse.json(application);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.application.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
