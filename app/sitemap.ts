import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE } from "@/lib/site";

// Refresh hourly so new properties appear without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/apply`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE.url}/terms-and-conditions`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE.url}/accessibility`, changeFrequency: "yearly", priority: 0.2 },
  ];

  try {
    const cities = await prisma.city.findMany({
      select: { slug: true, listings: { select: { updatedAt: true } } },
    });
    for (const city of cities) {
      const updated = city.listings.map((l) => l.updatedAt.getTime());
      pages.push({
        url: `${SITE.url}/cities/${city.slug}`,
        lastModified: updated.length ? new Date(Math.max(...updated)) : undefined,
        changeFrequency: "daily",
        priority: 0.8,
      });
    }
  } catch (err) {
    // DB may be unreachable at build time; ship the static pages and let the
    // next revalidation add the property pages.
    console.error("sitemap city lookup failed:", err);
  }

  return pages;
}
