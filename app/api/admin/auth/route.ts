import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  isAuthenticated,
  sessionValue,
  verifyPassword,
} from "@/lib/adminAuth";

import { readJsonObject, RequestError } from "@/lib/requestBody";
import { rateLimit } from "@/lib/rateLimit";
import { SESSION_SECONDS } from "@/lib/session";

const COOKIE_OPTIONS = {
  httpOnly: true,
  // Only sent over HTTPS in production; plain http://localhost still works in dev.
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}

export async function POST(request: NextRequest) {
  let password: unknown;
  try {
    const budget = await rateLimit(request, "admin-login", 10, 900);
    if (!budget.allowed) return NextResponse.json({ error: "Too many login attempts. Please try later." }, { status: 429, headers: { "Retry-After": String(budget.retryAfter) } });
    ({ password } = await readJsonObject(request, 4096));
  } catch (error) {
    if (error instanceof RequestError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("Admin login unavailable.");
    return NextResponse.json({ error: "Sign-in is temporarily unavailable." }, { status: 503 });
  }

  if (!verifyPassword(password)) {
    // Same response whether the password is wrong or ADMIN_PASSWORD is unset —
    // don't tell an attacker which.
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const value = sessionValue();
  if (!value) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, value, {
    ...COOKIE_OPTIONS,
    maxAge: SESSION_SECONDS, // 7 days
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  });
  return response;
}
