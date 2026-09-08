import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { screenTenant } from "@/lib/screenTenant";
import { isAuthenticated } from "@/lib/adminAuth";
import { parseApplication } from "@/lib/applicationInput";
import { readJsonObject, RequestError } from "@/lib/requestBody";
import { rateLimit } from "@/lib/rateLimit";

export const maxDuration = 60;


export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const archived = searchParams.get("archived") === "true";

  const applications = await prisma.application.findMany({
    where: { archived },
    orderBy: { createdAt: "desc" },
    omit: { ssn: true, spouseSsn: true, childrenResiding: true },
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
      console.error(`${label}: transient database failure; retrying once.`);
      await new Promise((r) => setTimeout(r, 300));
      return await fn();
    }
    throw err;
  }
}

export async function POST(request: NextRequest) {
  let data: ReturnType<typeof parseApplication>;
  try {
    const budget = await rateLimit(request, "application", 10, 3600);
    if (!budget.allowed) return NextResponse.json({ error: "Too many submissions. Please try later or call us." }, { status: 429, headers: { "Retry-After": String(budget.retryAfter) } });
    data = parseApplication(await readJsonObject(request));
  } catch (error) {
    if (error instanceof RequestError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("Application intake unavailable.");
    return NextResponse.json({ error: "We couldn't accept your application. Please try again or call us." }, { status: 503 });
  }
  let listingId = data.listingId;

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
    } catch {
      console.error("Listing lookup failed; saving without listing link.");
      listingId = null;
    }
  }

  // 1) Save the application. This is the only step allowed to fail the request.
  let application;
  try {
    application = await withDbRetry(
      () =>
        prisma.application.create({
          data: { ...data, listingId, rentPrice },
          omit: { ssn: true, spouseSsn: true, childrenResiding: true },
        }),
      "application create"
    );
  } catch {
    console.error("Application create failed.");
    return NextResponse.json(
      { error: "We couldn't save your application. Please try again." },
      { status: 503 }
    );
  }

  // 2) AI screening is best-effort. A saved application must NEVER be reported
  //    to the applicant as a failure just because screening/update hiccuped.
  try {
    if (application.manualReviewRequested) return NextResponse.json({ ok: true, id: application.id }, { status: 201 });
    const result = await screenTenant(application, rentPrice);
    if (result.score > 0) {
      await withDbRetry(
        () =>
          prisma.application.update({
            where: { id: application.id },
            data: { aiScore: result.score, aiSummary: result.summary },
          }),
        "application screening update"
      );
      return NextResponse.json({ ok: true, id: application.id }, { status: 201 });
    }
    // Log the id only — the summary carries the applicant's income figures.
    console.error(
      "Screening returned an error score for application:",
      application.id
    );
  } catch {
    console.error("Screening/update failed; application remains saved.");
  }

  return NextResponse.json({ ok: true, id: application.id }, { status: 201 });
}
