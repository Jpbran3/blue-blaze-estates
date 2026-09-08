import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { screenTenant } from "@/lib/screenTenant";
import { isAuthenticated } from "@/lib/adminAuth";
import { readJsonObject, RequestError, applicationText } from "@/lib/requestBody";

// Give the function more time on Vercel Pro/Teams (hobby stays at 10s)
export const maxDuration = 60;


const EDITABLE_FIELDS = [
  "applicantName",
  "phone",
  "email",
  "interest",
  "presentAddress",
  "townStateZip",
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
  "spouseEmployer",
  "spouseEmployerAddress",
  "spouseEmployerTownStateZip",
  "spouseEmployerPhone",
  "spouseEmploymentDuration",
  "spouseMonthlyWages",
  "spousePreviousEmployer",
  "occupantCount",
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
  let body: Record<string, unknown>;
  try { body = await readJsonObject(request); }
  catch (error) { return NextResponse.json({ error: error instanceof RequestError ? error.message : "Invalid request." }, { status: error instanceof RequestError ? error.status : 400 }); }

  const updateData: Record<string, string | boolean | null> = {};

  if (body.status !== undefined) {
    if (!["new", "contacted", "approved", "rejected"].includes(String(body.status))) return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    updateData.status = String(body.status);
  }
  if (body.archived !== undefined) {
    if (typeof body.archived !== "boolean") return NextResponse.json({ error: "Invalid archive value." }, { status: 400 });
    updateData.archived = body.archived;
  }

  for (const field of EDITABLE_FIELDS) {
    if (field in body) {
      try { updateData[field] = applicationText(body, field, ["applicantName", "phone", "electronicSignature"].includes(field)); }
      catch { return NextResponse.json({ error: `Invalid ${field}.` }, { status: 400 }); }
    }
  }

  const application = await prisma.application.update({
    where: { id },
    data: updateData,
    omit: { ssn: true, spouseSsn: true, childrenResiding: true },
  });

  // Re-run AI screening whenever content fields are edited.
  // Always runs — status/archived-only updates don't contain any EDITABLE_FIELDS.
  const hasContentChanges = EDITABLE_FIELDS.some((f) => f in body);
  if (hasContentChanges && !application.manualReviewRequested) {
    const result = await screenTenant(application, application.rentPrice);

    // Only write the new score if the AI call actually succeeded (score > 0).
    // score == 0 means the API returned an error — preserve the existing score
    // so the admin doesn't see their real score disappear.
    if (result.score > 0) {
      const rescreened = await prisma.application.update({
        where: { id },
        data: { aiScore: result.score, aiSummary: result.summary },
        omit: { ssn: true, spouseSsn: true, childrenResiding: true },
      });
      return NextResponse.json(rescreened);
    }

    // Screening failed — return the saved field changes but keep old score intact
    console.error("Re-screening failed after admin edit; manual review required.");
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
