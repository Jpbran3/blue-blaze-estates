"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-blue-900 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <svg
            width="36"
            height="36"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
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
          <span className="font-display text-xl font-bold tracking-tight group-hover:text-blue-200 transition-colors">
            Blue Blaze Estates
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-blue-200 transition-colors">
            Home
          </Link>
          <Link
            href="/apply"
            className="bg-white text-blue-900 px-4 py-2 rounded-full font-semibold hover:bg-blue-100 transition-colors"
          >
            Apply Now
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center justify-center h-11 w-11 -mr-2 rounded-md hover:bg-blue-800 transition-colors cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-950 px-4 pb-4 flex flex-col gap-3 text-sm font-medium">
          <Link
            href="/"
            className="hover:text-blue-200 transition-colors py-1"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/apply"
            className="bg-white text-blue-900 px-4 py-2 rounded-full font-semibold hover:bg-blue-100 transition-colors text-center"
            onClick={() => setMenuOpen(false)}
          >
            Apply Now
          </Link>
        </div>
      )}
    </header>
  );
}
