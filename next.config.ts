import type { NextConfig } from "next";

// Content-Security-Policy — an ALLOWLIST policy, not a nonce or hash policy.
//
// Be precise about what this does and does not buy, because the difference
// matters: `script-src` includes 'unsafe-inline', so this CSP does NOT stop an
// injected inline <script>. What it does do is confine script, style, image,
// font and connection sources to this origin (plus Vercel Blob for listing
// images), forbid framing, and forbid plugins and <base> rewriting.
//
// The stronger nonce + 'strict-dynamic' policy was implemented, tested, and
// removed: Next.js only injects nonces into per-request renders, so this site's
// statically prerendered pages get none and every script is blocked. Measured:
// /privacy-policy produced 10 CSP violations and no hydration. See proxy.ts for
// the full finding. Making that policy viable would mean forcing dynamic
// rendering on every page — an architectural change, not a compliance repair.
//
// Carve-outs that are load-bearing:
//   - 'unsafe-inline' on script-src: Next's inline bootstrap/hydration scripts.
//   - 'unsafe-inline' on style-src: Tailwind v4 and next/font inline styles.
//   - blob:/data: on img-src: the listing lightbox and next/image.
// If a third-party script is ever added, allow-list its exact origin HERE.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.public.blob.vercel-storage.com",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Vercel already sends HSTS; set it explicitly so the guarantee survives a
  // move off Vercel.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework/version to attackers.
  poweredByHeader: false,
  images: {
    localPatterns: [
      { pathname: "/images/**" },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // The application form and the admin dashboard both handle personal
        // data; keep them out of caches and out of search results entirely.
        source: "/apply",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, private",
          },
        ],
      },
      {
        source: "/admin",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, private",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, private",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
