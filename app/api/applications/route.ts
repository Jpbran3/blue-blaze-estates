import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { screenTenant } from "@/lib/screenTenant";
import { isAuthenticated } from "@/lib/adminAuth";
import { readJsonObject, RequestError } from "@/lib/requestBody";
import { parseApplication } from "@/lib/applicationInput";
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
  });
  return NextResponse.json(applications);
}

// Transient libSQL/Turso errors (a reused HTTP connection can go stale between
// serverless invocations). Retrying the same op once almost always succeeds.
const RETRYABLE_DB_ERROR =
  /stream not found|connection|timed? ?out|reset|ECONN|closed|unavailable|hyper|broken pipe|EPIPE/i;

/**
 * Database and provider errors can carry row values, connection strings and
 * request fragments. Log a stable label plus the error *type* only — never the
 * message, stack, or any applicant field.
 */
function logFailure(label: string, err: unknown) {
  const kind =
    err instanceof Error ? err.constructor.name : typeof err;
  console.error(`${label} (${kind})`);
}

async function withDbRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (RETRYABLE_DB_ERROR.test(msg)) {
      // The matched category is safe to log; the raw message is not.
      console.error(`${label} hit a transient DB error — retrying once`);
      await new Promise((r) => setTimeout(r, 300));
      return await fn();
    }
    throw err;
  }
}

export async function POST(request: NextRequest) {
  // Throttle before touching the body: submissions are unauthenticated and
  // write to the database, so this is the spam and abuse boundary.
  try {
    // 10/hour, not 5: the counter increments on every attempt including
    // validation failures, and a real applicant filling in a long form can
    // legitimately retry several times. Still far below any useful spam rate.
    const limit = await rateLimit(request, "application", 10, 3600);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many applications submitted. Please try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );
    }
  } catch (err) {
    // A rate-limit outage must not block a genuine applicant.
    logFailure("Rate limit check failed (allowing request)", err);
  }

  // Parse and validate. parseApplication allow-lists fields, so removed fields
  // (ssn, spouseSsn, childrenResiding) and admin-only fields (status, aiScore,
  // archived) are ignored even if a caller submits them.
  let input: ReturnType<typeof parseApplication>;
  try {
    const body = await readJsonObject(request);
    input = parseApplication(body);
  } catch (err) {
    if (err instanceof RequestError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    logFailure("Application parse failed", err);
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { manualReviewRequested, listingId: rawListingId, ...fields } = input;

  // Normalize listingId: the form sends "" when no unit is selected. An empty
  // string (or any id that doesn't match a real listing) would violate the
  // Listing foreign key and make the insert fail, so coerce those to null.
  let listingId: string | null = rawListingId;

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
      logFailure("Listing lookup failed (saving without listing link)", err);
      listingId = null;
    }
  }

  // 1) Save the application. This is the only step allowed to fail the request.
  let application;
  try {
    application = await withDbRetry(
      () =>
        prisma.application.create({
          data: {
            ...fields,
            listingId,
            rentPrice,
            manualReviewRequested,
            // ssn / spouseSsn / childrenResiding are intentionally never written.
            // The columns remain only so existing rows are not destroyed.
          },
        }),
      "application create"
    );
  } catch (err) {
    logFailure("Application create failed", err);
    return NextResponse.json(
      { error: "We couldn't save your application. Please try again." },
      { status: 503 }
    );
  }

  // 2) Automated screening — skipped entirely when the applicant asked for a
  //    human-only review. Nothing about their application is sent to the model.
  if (!manualReviewRequested) {
    try {
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
      } else {
        console.error("Screening returned an error score for application:", application.id);
      }
    } catch (err) {
      // Screening is best-effort: a saved application must never be reported to
      // the applicant as a failure because screening hiccuped.
      logFailure("Screening/update failed (application still saved)", err);
    }
  }

  // Minimal receipt. The applicant's browser has no need for the stored row or
  // the internal screening score/summary, and returning them would leak the
  // preliminary assessment to the person being assessed.
  return NextResponse.json(
    {
      id: application.id,
      received: true,
      manualReviewRequested,
    },
    { status: 201 }
  );
}
