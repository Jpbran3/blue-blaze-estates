"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex-1 max-w-2xl mx-auto px-6 py-24 text-center focus:outline-none"
    >
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">
        Something went wrong
      </h1>
      <p className="text-gray-600 mb-8">
        This page didn&apos;t load. Please try again, or call us at{" "}
        <a href="tel:6189427624" className="text-blue-800 underline">
          618-942-7624
        </a>
        .
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          type="button"
          onClick={() => retry()}
          className="bg-blue-900 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors duration-200"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border border-blue-900 text-blue-900 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
        >
          Go to the homepage
        </Link>
      </div>
    </main>
  );
}
