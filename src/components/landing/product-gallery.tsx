"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { INITIAL_PRODUCT_IMAGES } from "@/lib/constants";

interface GalleryProps {
  images?: Array<{ id: string; url: string; alt?: string }>;
}

export function ProductGallery({ images = INITIAL_PRODUCT_IMAGES }: GalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const activeImage = images[currentIndex] || images[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section id="gallery" className="py-20 bg-brand-surface relative border-y border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest text-brand-gold uppercase">
            প্রোডাক্ট ভিজ্যুয়াল গ্যালারি
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-text font-display mt-2">
            আসল পণ্যের বাস্তব ছবি
          </h2>
          <p className="text-sm sm:text-base text-brand-text-muted mt-3">
            আসল বোতল, প্যাকেজিং লেবেল এবং বাস্তব পরিবেশের ছবি। কোনো অপ্রাসঙ্গিক বা নকল কম্পিউটার গ্রাফিক্স নয়।
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Preview Container */}
          <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden bg-brand-bg border border-brand-borderGold shadow-luxury group">
            <Image
              src={activeImage.url}
              alt={activeImage.alt || "FORCE FUEL Eagle Endurance For Men"}
              fill
              className="object-cover object-center transition-all duration-500 ease-out"
              sizes="(max-width: 1024px) 100vw, 800px"
              priority
            />

            {/* Click to open Lightbox Button */}
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute top-4 right-4 p-3 rounded-xl bg-brand-bg/80 hover:bg-brand-bg backdrop-blur-md border border-brand-border text-brand-text hover:text-brand-gold transition-all duration-200 shadow-lg"
              title="বড় করে দেখুন"
              aria-label="বড় করে দেখুন"
            >
              <Maximize2 className="w-5 h-5" />
            </button>

            {/* Navigation Arrows for Main View */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-brand-bg/80 hover:bg-brand-bg backdrop-blur-md border border-brand-border text-brand-text hover:text-brand-gold transition-all opacity-0 group-hover:opacity-100"
              aria-label="পূর্ববর্তী ছবি"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-brand-bg/80 hover:bg-brand-bg backdrop-blur-md border border-brand-border text-brand-text hover:text-brand-gold transition-all opacity-0 group-hover:opacity-100"
              aria-label="পরবর্তী ছবি"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Badge Indicator */}
            <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-sm border border-brand-border text-xs text-brand-text-muted">
              <span>ছবি {currentIndex + 1} / {images.length}</span>
            </div>
          </div>

          {/* Clickable Thumbnails */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4 mt-6">
            {images.map((img, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={img.id || idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative aspect-square rounded-2xl overflow-hidden bg-brand-bg border-2 transition-all duration-200 ${
                    isActive
                      ? "border-brand-gold shadow-gold scale-[1.02]"
                      : "border-brand-border hover:border-brand-borderGold opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`ছবি ${idx + 1} নির্বাচন করুন`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || `থাম্বনেইল ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 150px"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-brand-gold/10 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="বন্ধ করুন"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="পূর্ববর্তী ছবি"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl max-h-[85vh] w-full h-[75vh] flex items-center justify-center">
            <Image
              src={activeImage.url}
              alt={activeImage.alt || "FORCE FUEL পূর্ণ ভিউ"}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="পরবর্তী ছবি"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-brand-text-muted bg-brand-surface/90 px-4 py-2 rounded-full border border-brand-border">
            {currentIndex + 1} / {images.length} — আসল প্যাকেজিং এর ফটোগ্রাফ
          </div>
        </div>
      )}
    </section>
  );
}
