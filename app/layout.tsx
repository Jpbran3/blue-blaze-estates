import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Blue Blaze Estates — Quality Rentals in Southern Illinois",
  description:
    "Quality rentals in the Southern Illinois area with a focus on providing quiet living. Now leasing at Blue Blaze Mobile Home Park in Herrin, IL.",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} ${playfair.variable} min-h-full flex flex-col bg-gray-50 text-gray-800 antialiased`}
      >
        {/*
          Skip link (WCAG 2.1 AA, 2.4.1). Visually hidden until it receives
          keyboard focus, so keyboard and screen reader users can jump past the
          header nav straight to the page content.
        */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-blue-900 focus:shadow-lg focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-700"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
