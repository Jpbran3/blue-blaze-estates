import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg
                width="30"
                height="30"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="40" height="40" rx="8" fill="white" />
                <path
                  d="M20 6L34 17.5V32a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V17.5L20 6z"
                  fill="#1d4ed8"
                />
                <text
                  x="15.5"
                  y="26"
                  fontSize="15"
                  fontWeight="700"
                  fill="white"
                  textAnchor="middle"
                  fontFamily="Georgia, 'Times New Roman', serif"
                >
                  B
                </text>
                <text
                  x="24.5"
                  y="33"
                  fontSize="15"
                  fontWeight="700"
                  fill="#93c5fd"
                  textAnchor="middle"
                  fontFamily="Georgia, 'Times New Roman', serif"
                >
                  B
                </text>
              </svg>
              <span className="text-lg font-bold">Blue Blaze Estates</span>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              Quality rentals in the Southern Illinois area with a focus on providing quiet living.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-400">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/apply" className="hover:text-white transition-colors">
                  Apply Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-400">
              Contact Us
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:6189427624" className="hover:text-white transition-colors">
                  618-942-7624
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:blueblazeestates@gmail.com" className="hover:text-white transition-colors">
                  blueblazeestates@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Blue Blaze Estates. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
