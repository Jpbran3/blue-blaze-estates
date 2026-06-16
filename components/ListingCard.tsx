"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface ListingCardProps {
  id: string;
  title: string;
  description?: string | null;
  bedrooms: number;
  bathrooms: number;
  rentPrice: number;
  imageUrl?: string | null;
  images?: string[];
  citySlug: string;
}

export default function ListingCard({
  title,
  description,
  bedrooms,
  bathrooms,
  rentPrice,
  imageUrl,
  images,
  citySlug,
}: ListingCardProps) {
  const allImages =
    images && images.length > 0 ? images : imageUrl ? [imageUrl] : [];
  const mainImage = allImages[0] ?? null;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % allImages.length);
  }, [allImages.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, next, prev]);

  function openLightbox(index: number) {
    setActiveIndex(index);
    setLightboxOpen(true);
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col border border-gray-100">
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {mainImage ? (
            <button
              type="button"
              onClick={() => openLightbox(0)}
              className="w-full h-full block focus:outline-none"
              aria-label="View photos"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mainImage}
                alt={title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              {allImages.length > 1 && (
                <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full pointer-events-none">
                  1 / {allImages.length}
                </span>
              )}
            </button>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{title}</h3>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
              </svg>
              {bedrooms} bed{bedrooms !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 10H7V7c0-.55.45-1 1-1s1 .45 1 1h2c0-1.65-1.35-3-3-3S5 5.35 5 7v3H3c-.55 0-1 .45-1 1v2c0 1.65 1.35 3 3 3v3h2v-3h10v3h2v-3c1.65 0 3-1.35 3-3v-2c0-.55-.45-1-1-1z" />
              </svg>
              {bathrooms} bath{bathrooms !== 1 ? "s" : ""}
            </span>
          </div>

          {description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{description}</p>
          )}

          <div className="mt-auto flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              ${rentPrice.toLocaleString()}
              <span className="text-sm font-normal text-gray-500">/mo</span>
            </span>
            <Link
              href={`/apply?city=${citySlug}`}
              className="bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && allImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close */}
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl leading-none z-10"
            aria-label="Close"
          >
            ×
          </button>

          {/* Counter */}
          {allImages.length > 1 && (
            <span className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {activeIndex + 1} / {allImages.length}
            </span>
          )}

          {/* Prev */}
          {allImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 text-white/80 hover:text-white text-4xl leading-none z-10 p-2"
              aria-label="Previous"
            >
              ‹
            </button>
          )}

          {/* Image */}
          <div
            className="max-w-4xl max-h-[85vh] px-16"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={allImages[activeIndex]}
              alt={`${title} — photo ${activeIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Next */}
          {allImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 text-white/80 hover:text-white text-4xl leading-none z-10 p-2"
              aria-label="Next"
            >
              ›
            </button>
          )}

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {allImages.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`w-12 h-12 rounded overflow-hidden border-2 transition-all ${
                    i === activeIndex ? "border-white scale-110" : "border-white/30 opacity-60 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
