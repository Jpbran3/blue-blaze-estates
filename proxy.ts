import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  // Block browser cross-origin mutations, including cookie-authenticated admin actions.
  if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    const origin = request.headers.get("origin");
    if (request.headers.get("sec-fetch-site") === "cross-site" ||
        (origin && origin !== request.nextUrl.origin)) {
      return NextResponse.json({ error: "Cross-origin requests are not allowed." }, { status: 403 });
    }
  }
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";
  const policy = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'", // Inline geometry/style attributes in image and gallery components.
    "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com",
    "font-src 'self' data:",
    `connect-src 'self' https://*.public.blob.vercel-storage.com${isDev ? " ws: wss:" : ""}`,
    "frame-ancestors 'none'", "form-action 'self'", "base-uri 'self'", "object-src 'none'",
    ...(!isDev ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
  const headers = new Headers(request.headers);
  headers.set("x-nonce", nonce);
  headers.set("Content-Security-Policy", policy);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Content-Security-Policy", policy);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|images/|favicon|.*\\.(?:svg|png|jpg|ico|woff2)$).*)"],
};
