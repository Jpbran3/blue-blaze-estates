import type { Metadata } from "next";

/**
 * Public-facing site facts used by search engines and link previews
 * (sitemap, robots, Open Graph, structured data). Keep these in step with the
 * footer and the legal pages; nothing here should state a fact the owner has
 * not confirmed.
 */
export const SITE = {
  name: "Blue Blaze Estates",
  url: "https://www.blueblazeestates.com",
  description:
    "Quality rentals in Herrin and the Southern Illinois area, with a focus on quiet living. Housing vouchers and rental assistance are welcome. Now leasing at Blue Blaze Mobile Home Park in Herrin, IL.",
  phone: "618-942-7624",
  email: "blueblazeestates@gmail.com",
  areaServed: ["Herrin, Illinois", "Southern Illinois"],
} as const;

/**
 * Per-page metadata with a matching canonical URL and link-preview title.
 * Open Graph fields are not inherited from `title`/`description`, so without
 * this a shared link to any page would preview with the homepage's wording.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: "en_US",
      title,
      description,
      url: path,
    },
  };
}
