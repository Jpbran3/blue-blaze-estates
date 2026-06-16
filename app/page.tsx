import { prisma } from "@/lib/prisma";
import CityCard from "@/components/CityCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import Link from "next/link";

export const revalidate = 60;

async function getCities() {
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
              icon: "🏠",
              title: "Quality Homes",
              desc: "Well-maintained properties ready for move-in",
            },
            {
              icon: "💲",
              title: "Fair Pricing",
              desc: "Transparent, competitive rents with no hidden fees",
            },
            {
              icon: "⚡",
              title: "Fast Response",
              desc: "Responsive management when you need us",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="p-4">
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cities */}
      <section id="cities" className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
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
          <h2 className="text-3xl font-bold mb-4">Ready to Apply?</h2>
          <p className="text-gray-300 mb-8 text-lg">
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
