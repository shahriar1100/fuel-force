"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Minus, Zap, ShieldCheck, Truck, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/cart-context";
import {
  BRAND_NAME,
  PRODUCT_NAME,
  PRODUCT_PRICE,
  PRODUCT_REGULAR_PRICE,
  INITIAL_PRODUCT_IMAGES,
} from "@/lib/constants";

export function OrderCTASection() {
  const [quantity, setQuantity] = useState(1);
  const { buyNow } = useCart();

  const handleIncrement = () => setQuantity((q) => Math.min(20, q + 1));
  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));

  return (
    <section className="py-20 bg-luxury-hero relative border-t border-brand-border overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-brand-purple/20 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-brand-surface/90 border border-brand-borderGold shadow-luxury backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Product Image Thumbnail */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden border border-brand-borderGold bg-black/40 shadow-gold">
                <Image
                  src={INITIAL_PRODUCT_IMAGES[0].url}
                  alt="FORCE FUEL Eagle Endurance"
                  fill
                  className="object-cover"
                  sizes="256px"
                />
              </div>
            </div>

            {/* Content & Action */}
            <div className="lg:col-span-8 flex flex-col space-y-5">
              <div>
                <span className="text-xs font-bold tracking-widest text-brand-gold uppercase">
                  প্রাকৃতিক শারীরিক সক্ষমতা ফিরে পেতে প্রস্তুত?
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-text font-display mt-1">
                  আজই অর্ডার করুন {BRAND_NAME}
                </h2>
                <p className="text-sm text-brand-text-muted mt-1">
                  ৬০ ডোজ আসল স্ট্যান্ডার্ডাইজড G115® জিনসেং ও KSM-66® অশ্বগন্ধা রুট এক্সট্রাক্ট। সারা বাংলাদেশে দ্রুত ক্যাশ অন ডেলিভারি।
                </p>
              </div>

              {/* Price & Savings */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-brand-gold font-display">
                  ৳{(PRODUCT_PRICE * quantity).toLocaleString("bn-BD")}
                </span>
                <span className="text-base text-brand-text-dim line-through">
                  ৳{(PRODUCT_REGULAR_PRICE * quantity).toLocaleString("bn-BD")}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-brand-purple/25 text-brand-text text-xs font-bold">
                  ক্যাশ অন ডেলিভারি
                </span>
              </div>

              {/* Quantity selector */}
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-semibold text-brand-text">পরিমাণ নির্বাচন করুন:</span>
                <div className="flex items-center border border-brand-border rounded-xl bg-brand-card overflow-hidden">
                  <button
                    onClick={handleDecrement}
                    className="p-2.5 hover:bg-white/10 text-brand-text-muted hover:text-brand-text transition-colors"
                    aria-label="পরিমাণ কমান"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-brand-text">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="p-2.5 hover:bg-white/10 text-brand-text-muted hover:text-brand-text transition-colors"
                    aria-label="পরিমাণ বাড়ান"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button
                  onClick={() => buyNow(quantity)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 py-4 px-10 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-black font-extrabold text-lg shadow-gold transition-all duration-200 active:scale-[0.98]"
                >
                  <Zap className="w-5 h-5 fill-black" />
                  <span>এখনই অর্ডার করুন (ক্যাশ অন ডেলিভারি)</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-5 pt-3 border-t border-brand-border text-xs text-brand-text-muted">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-brand-gold" />
                  <span>দ্রুত হোম ডেলিভারি সার্ভিস</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-gold" />
                  <span>অগ্রিম কোনো টাকা দিতে হবে না</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                  <span>১০০% আসল প্রোডাক্টের নিশ্চয়তা</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
