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
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    // Respect users who prefer reduced motion — don't auto-advance.
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (paused || reduceMotion) return;

    const interval = setInterval(() => {
      setCurrent((i) => (i + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [paused]);

  return (
    <section
      className="relative text-white overflow-hidden"
      style={{ minHeight: "520px" }}
      onFocusCapture={() => setPaused(true)}
      aria-roledescription="carousel"
      aria-label="Blue Blaze Estates property photos"
    >
      {heroImages.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={i === current ? `Blue Blaze Estates property view ${i + 1}` : ""}
          aria-hidden={i !== current}
          fill
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          priority={i === 0}
        />
      ))}
      <div className="absolute inset-0 bg-black/65" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 min-h-[520px] pt-12 pb-24 flex flex-col items-center justify-center text-center">
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
          Blue Blaze Estates
        </h1>
        <p className="text-xl md:text-2xl text-gray-100 font-light mb-3">
          Quality Homes in the Southern Illinois Area
        </p>
        <p className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto mb-10">
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

      {/* Slide indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1">
        <button type="button" onClick={() => setPaused(p => !p)} aria-label={paused ? "Play slideshow" : "Pause slideshow"} className="mr-2 min-h-11 rounded-lg bg-black/70 px-3 text-sm text-white">
          {paused ? "Play" : "Pause"}
        </button>
        {heroImages.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => { setCurrent(i); setPaused(true); }}
            aria-label={`Show slide ${i + 1} of ${heroImages.length}`}
            aria-current={i === current}
            className="flex h-11 w-11 items-center justify-center rounded-full"
          >
            <span aria-hidden="true" className={`block h-3 rounded-full border border-white ${i === current ? "w-6 bg-white" : "w-3 bg-black/70"}`} />
          </button>
        ))}
      </div>
    </section>
  );
}
