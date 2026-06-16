import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ListingCard from "@/components/ListingCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const revalidate = 60;

interface Props {
  params: Promise<{ citySlug: string }>;
}

async function getCity(slug: string) {
  try {
    return await prisma.city.findUnique({
      where: { slug },
      include: {
        listings: {
          where: { status: "available" },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  } catch (err) {
    // DB may be empty/unmigrated (e.g. fresh Turso). Treat as not found.
    console.error("getCity failed, treating as not found:", err);
    return null;
  }
}

export async function generateMetadata({ params }: Props) {
  const { citySlug } = await params;
  let city = null;
  try {
    city = await prisma.city.findUnique({ where: { slug: citySlug } });
  } catch (err) {
    console.error("generateMetadata city lookup failed:", err);
  }
  if (!city) return { title: "City Not Found" };
  return {
    title: `${city.name} — Blue Blaze Estates`,
    description: `Browse available rental properties — ${city.name}.`,
  };
}

export default async function CityPage({ params }: Props) {
  const { citySlug } = await params;
  const city = await getCity(citySlug);

  if (!city) notFound();

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-800">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">{city.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {city.name}
          </h1>
          <p className="text-gray-500">
            {city.listings.length} available unit
            {city.listings.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Listings */}
        {city.listings.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <svg
              className="mx-auto mb-4 h-14 w-14 text-gray-300"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No Units Currently Available
            </h2>
            <p className="mb-6">
              No units currently available. Check back soon!
            </p>
            <Link
              href="/apply"
              className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors duration-200"
            >
              Join the Waitlist
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {city.listings.map((listing) => {
              let parsedImages: string[] = [];
              try {
                parsedImages = listing.images ? JSON.parse(listing.images) : [];
              } catch {
                parsedImages = [];
              }
              return (
                <ListingCard
                  key={listing.id}
                  id={listing.id}
                  title={listing.title}
                  description={listing.description}
                  bedrooms={listing.bedrooms}
                  bathrooms={listing.bathrooms}
                  rentPrice={listing.rentPrice}
                  imageUrl={listing.imageUrl}
                  images={parsedImages}
                  citySlug={city.slug}
                />
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Interested in a Unit?
          </h2>
          <p className="text-gray-600 mb-5">
            Submit an application and we&apos;ll reach out to schedule a showing.
          </p>
          <Link
            href={`/apply?city=${city.slug}`}
            className="bg-blue-900 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-800 transition-colors duration-200 inline-block"
          >
            Apply Now
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
