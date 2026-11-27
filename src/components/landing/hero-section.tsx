"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Minus, ShoppingBag, Zap, ShieldCheck, CheckCircle2, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/cart-context";
import {
  BRAND_NAME,
  PRODUCT_NAME,
  PRODUCT_NAME_BN,
  PRODUCT_SUBTITLE,
  PRODUCT_PRICE,
  PRODUCT_REGULAR_PRICE,
  INITIAL_PRODUCT_IMAGES,
} from "@/lib/constants";

interface HeroSectionProps {
  product?: {
    id: string;
    name: string;
    price: number;
    regular_price: number;
    stock_quantity?: number;
    description?: string;
  };
  bannerImage?: {
    id: string;
    url: string;
    alt?: string;
  };
}

export function HeroSection({ product, bannerImage }: HeroSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, buyNow } = useCart();

  const price = product?.price ?? PRODUCT_PRICE;
  const regularPrice = product?.regular_price ?? (price + 800);
  const savings = Math.max(0, regularPrice - price);
  const heroImgUrl = bannerImage?.url || INITIAL_PRODUCT_IMAGES[0].url;
  const heroImgAlt = bannerImage?.alt || INITIAL_PRODUCT_IMAGES[0].alt;

  const handleIncrement = () => setQuantity((q) => Math.min(20, q + 1));
  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));

  return (
    <section className="relative pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20 overflow-hidden bg-luxury-hero">
      {/* Ambient background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-purple/20 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-brand-gold/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Product Imagery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex flex-col items-center"
          >
            <div className="relative w-full max-w-lg aspect-square rounded-3xl overflow-hidden border border-brand-borderGold bg-brand-surface/60 p-4 shadow-luxury group">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src={heroImgUrl}
                  alt={heroImgAlt}
                  fill
                  priority
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Floating Verified Extract Badge */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 p-2.5 sm:p-3.5 rounded-xl bg-brand-bg/90 backdrop-blur-md border border-brand-border flex items-center justify-between text-[11px] sm:text-xs text-brand-text">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-brand-gold animate-pulse flex-shrink-0" />
                  <span className="font-semibold text-brand-text truncate">G115® ও KSM-66®</span>
                </div>
                <span className="text-brand-gold font-bold flex-shrink-0">পূর্ণ ৬০ ডোজ</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Product Content & Purchase Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-6 flex flex-col space-y-5 sm:space-y-6"
          >
            {/* Category / Brand Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-surface border border-brand-border w-fit text-xs text-brand-gold font-semibold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-brand-gold" />
              <span>{BRAND_NAME} অফিসিয়াল সাপ্লিমেন্ট</span>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-brand-text tracking-tight font-display leading-[1.15]">
                {PRODUCT_NAME}
              </h1>
              <p className="mt-1.5 sm:mt-2 text-sm sm:text-lg text-brand-gold font-medium">
                {PRODUCT_NAME_BN}
              </p>
              <p className="mt-1 text-xs sm:text-base text-brand-text-muted">
                {PRODUCT_SUBTITLE}
              </p>
            </div>

            {/* Verified Packaging Callouts */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 py-2">
              <div className="p-2 sm:p-3 rounded-xl bg-brand-card border border-brand-border text-center">
                <p className="text-[10px] sm:text-xs text-brand-text-muted">জিনসেং ফর্মুলা</p>
                <p className="text-xs sm:text-sm font-bold text-brand-gold mt-0.5 truncate">G115® এক্সট্রাক্ট</p>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-brand-card border border-brand-border text-center">
                <p className="text-[10px] sm:text-xs text-brand-text-muted">অশ্বগন্ধা মূল</p>
                <p className="text-xs sm:text-sm font-bold text-brand-purple-light mt-0.5 truncate">KSM-66®</p>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-brand-card border border-brand-border text-center">
                <p className="text-[10px] sm:text-xs text-brand-text-muted">মোট ডোজ</p>
                <p className="text-xs sm:text-sm font-bold text-brand-text mt-0.5 truncate">৬০ ক্যাপসুল</p>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-4 pt-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-brand-gold font-display">
                  ৳{price.toLocaleString("bn-BD")}
                </span>
                <span className="text-lg text-brand-text-dim line-through">
                  ৳{regularPrice.toLocaleString("bn-BD")}
                </span>
              </div>
              {savings > 0 && (
                <span className="px-2.5 py-1 rounded-md bg-brand-purple/20 border border-brand-purple/40 text-brand-text text-xs font-semibold">
                  ৳{savings.toLocaleString("bn-BD")} ছাড়
                </span>
              )}
            </div>

            {/* Short Intro */}
            <p className="text-sm sm:text-base text-brand-text-muted leading-relaxed">
              {product?.description || "আসল প্যাকেজিংয়ে প্রমাণিত বিশ্বখ্যাত স্ট্যান্ডার্ডাইজড G115® প্যানাক্স জিনসেং ও ফুল-স্পেকট্রাম KSM-66® অশ্বগন্ধা রুট এক্সট্রাক্টের সমন্বয়ে প্রস্তুত। এটি কর্মব্যস্ত পুরুষের শারীরিক শক্তি, স্ট্যামিনা, উদ্যম এবং স্বাভাবিক প্রাণশক্তি ধরে রাখতে অতুলনীয়।"}
            </p>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-brand-text">পরিমাণ নির্বাচন করুন:</span>
                <div className="flex items-center border border-brand-border rounded-xl bg-brand-surface overflow-hidden">
                  <button
                    onClick={handleDecrement}
                    className="p-3 hover:bg-white/5 text-brand-text-muted hover:text-brand-text transition-colors"
                    aria-label="পরিমাণ কমান"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-brand-text">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="p-3 hover:bg-white/5 text-brand-text-muted hover:text-brand-text transition-colors"
                    aria-label="পরিমাণ বাড়ান"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-brand-text-muted">
                  মোট: <strong className="text-brand-gold font-bold">৳{(price * quantity).toLocaleString("bn-BD")}</strong>
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 pt-2">
                <button
                  onClick={() => buyNow(quantity, price, heroImgUrl)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-black font-extrabold text-sm sm:text-base shadow-gold transition-all duration-200 active:scale-[0.98]"
                >
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-black flex-shrink-0" />
                  <span>এখনই অর্ডার করুন (COD)</span>
                </button>

                <button
                  onClick={() => addToCart(quantity, price, heroImgUrl)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl bg-brand-surface hover:bg-brand-cardHover border border-brand-borderGold text-brand-text font-bold text-sm sm:text-base transition-all duration-200 active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold flex-shrink-0" />
                  <span>ব্যাগে যোগ করুন</span>
                </button>
              </div>
            </div>

            {/* Trust Bullet Points */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-brand-border text-xs text-brand-text-muted">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <span>১০০% আসল সিল্ড বোতল</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <span>নিরাপদ ক্যাশ অন ডেলিভারি</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <span>সারা দেশে হোম ডেলিভারি</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
