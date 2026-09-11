import { NextRequest, NextResponse } from "next/server";

/**
 * Cross-origin write protection.
 *
 * The admin dashboard authenticates with a cookie, so a page on another origin
 * could otherwise trigger authenticated POST/PUT/DELETE requests from a signed-in
 * owner's browser. Rejecting cross-site mutations at the edge blocks that without
 * needing a CSRF token round-trip on every form.
 *
 * WHY THERE IS NO NONCE-BASED CSP HERE
 * -----------------------------------
 * A nonce CSP was tried and removed because it breaks this site. Next.js can only
 * inject nonces into pages it renders per-request; statically prerendered pages
 * are built before any request exists, so they receive no nonce attributes
 * (node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md —
 * "How nonces work in Next.js"). Because `'strict-dynamic'` makes browsers ignore
 * `'self'`, every script on a static page is then blocked.
 *
 * Measured on this codebase: /privacy-policy served 10 script tags and 0 nonce
 * attributes, producing 10 CSP violations and no hydration; the dynamic
 * /cities/[citySlug] route received 12 nonce attributes and worked. Adopting it
 * would have taken down the homepage, /apply, /admin and all three legal pages.
 *
 * The CSP therefore lives in next.config.ts, where it applies to static and
 * dynamic responses alike. It is an allowlist CSP, not a nonce/hash CSP — see the
 * accurate description of its limits there.
 */
export function proxy(request: NextRequest) {
  if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    const origin = request.headers.get("origin");
    const site = request.headers.get("sec-fetch-site");

    // sec-fetch-site is set by the browser and cannot be spoofed by page script.
    // A non-browser client (curl, a server job) sends neither header; those are
    // not subject to cookie-based CSRF, so absence is not treated as hostile.
    if (site === "cross-site" || (origin && origin !== request.nextUrl.origin)) {
      return NextResponse.json(
        { error: "Cross-origin requests are not allowed." },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|images/|favicon|.*\\.(?:svg|png|jpg|jpeg|ico|woff2)$).*)",
  ],
};
