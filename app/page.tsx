import { prisma } from "@/lib/prisma";
import CityCard from "@/components/CityCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import Link from "next/link";

export const revalidate = 60;

async function getCities() {
  if (!process.env.TURSO_DATABASE_URL) return [];

  try {
    const cities = await prisma.city.findMany({
      include: {
        _count: {
          select: { listings: { where: { status: "available" } } },
        },
      },
      orderBy: { name: "asc" },
    });
    return cities.map((c) => ({
      id: c.id,
      name: c.name,
      state: c.state,
      slug: c.slug,
      imageUrl: c.imageUrl,
      availableCount: c._count.listings,
    }));
  } catch (err) {
    // DB may be empty/unmigrated at build time (e.g. fresh Turso). Render an
    // empty list rather than failing the prerender; ISR will refill it.
    console.error("getCities failed, returning empty list:", err);
    return [];
  }
}

export default async function HomePage() {
  const cities = await getCities();

  return (
    <>
      <Header />

      <HeroCarousel />

      {/* Features strip */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            {
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              ),
              title: "Quality Homes",
              desc: "Well-maintained properties ready for move-in",
            },
            {
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ),
              title: "Fair Pricing",
              desc: "Transparent, competitive rents with no hidden fees",
            },
            {
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                />
              ),
              title: "Fast Response",
              desc: "Responsive management when you need us",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="p-4">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-900">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  {icon}
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cities */}
      <section id="cities" className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Browse Properties
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            We manage quality rental properties in the Southern Illinois area.
            Click a property to see available units.
          </p>
        </div>

        {cities.length === 0 ? (
          <p className="text-center text-gray-500">No cities listed yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <CityCard
                key={city.id}
                name={city.name}
                state={city.state}
                slug={city.slug}
                imageUrl={city.imageUrl}
                availableCount={city.availableCount}
              />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Apply?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Fill out our quick application form and we&apos;ll be in touch
            within one business day.
          </p>
          <Link
            href="/apply"
            className="bg-white text-blue-900 font-semibold px-10 py-4 rounded-lg text-lg hover:bg-blue-100 transition-colors duration-200 inline-block"
          >
            Start Your Application
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
