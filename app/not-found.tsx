import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Page Not Found — Blue Blaze Estates",
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 max-w-2xl mx-auto px-6 py-24 text-center focus:outline-none"
      >
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-800">
          404
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
          We couldn&apos;t find that page
        </h1>
        <p className="text-gray-600 mb-8">
          The unit or page you were looking for may have been rented or moved.
          Browse what&apos;s available now, or send us an application and
          we&apos;ll reach out when something opens up.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/#cities"
            className="bg-blue-900 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors duration-200"
          >
            Browse Properties
          </Link>
          <Link
            href="/apply"
            className="border border-blue-900 text-blue-900 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
          >
            Start an Application
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
