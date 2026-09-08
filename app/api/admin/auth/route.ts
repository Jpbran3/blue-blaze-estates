import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  isAuthenticated,
  sessionValue,
  verifyPassword,
} from "@/lib/adminAuth";

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
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
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
    maxAge: 60 * 60 * 24 * 7, // 7 days
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
