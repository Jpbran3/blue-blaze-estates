import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  SESSION_SECONDS,
  isAuthenticated,
  sessionValue,
  verifyPassword,
} from "@/lib/adminAuth";
import { rateLimit } from "@/lib/rateLimit";
import { readJsonObject, RequestError } from "@/lib/requestBody";

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
  // Throttle login attempts. Without this the admin password — the only thing
  // protecting every applicant's record — can be guessed at network speed.
  try {
    const limit = await rateLimit(request, "admin-login", 10, 900);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );
    }
  } catch {
    // Fail closed: if the throttle cannot be consulted, do not accept a login.
    return NextResponse.json(
      { error: "Sign-in is temporarily unavailable." },
      { status: 503 }
    );
  }

  let password: unknown;
  try {
    const body = await readJsonObject(request, 2048);
    password = body.password;
  } catch (err) {
    const status = err instanceof RequestError ? err.status : 400;
    return NextResponse.json({ error: "Invalid request body." }, { status });
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
    // Mirrors the expiry inside the signed token, which the server enforces.
    maxAge: SESSION_SECONDS,
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
