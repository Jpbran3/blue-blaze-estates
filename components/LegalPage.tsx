import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * Shared shell for the static legal pages (privacy, terms, accessibility) so
 * they share one set of typography and spacing rules.
 */
export default function LegalPage({
  title,
  effectiveDate,
  children,
}: {
  title: string;
  effectiveDate: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="max-w-3xl mx-auto px-6 py-12 focus:outline-none">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 transition-colors"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </Link>
        </div>

        <article
          className="bg-white rounded-2xl shadow-md p-8 md:p-10
            [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-10 [&_h2]:mb-3
            [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-6 [&_h3]:mb-2
            [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:mb-4
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:text-gray-700 [&_ul]:space-y-1.5
            [&_li]:leading-relaxed
            [&_a]:text-blue-900 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-blue-700
            [&_strong]:font-semibold [&_strong]:text-gray-900"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {title}
          </h1>
          <p className="text-sm text-gray-600 mb-8">
            Effective {effectiveDate}
          </p>
          {children}
        </article>
      </main>
      <Footer />
    </>
  );
}
