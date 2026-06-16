"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const heroImages = [
  "/images/park-1.jpg",
  "/images/park-2.jpg",
  "/images/park-3.jpg",
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((i) => (i + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative text-white overflow-hidden" style={{ height: "520px" }}>
      {heroImages.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt="Blue Blaze Estates properties"
          fill
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          priority={i === 0}
        />
      ))}
      <div className="absolute inset-0 bg-black/65" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
          Blue Blaze Estates
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 font-light mb-3">
          Quality Homes in the Southern Illinois Area
        </p>
        <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-10">
          Quality rentals in the Southern Illinois area with a focus on providing quiet living.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#cities"
            className="bg-white text-blue-900 font-semibold px-8 py-3 rounded-lg hover:bg-blue-100 transition-colors duration-200"
          >
            Browse Properties
          </a>
          <Link
            href="/apply"
            className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-blue-900 transition-colors duration-200"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </section>
  );
}
