"use client";

import React, { useState, useEffect } from "react";
import { Zap, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { PRODUCT_PRICE } from "@/lib/constants";

export function MobileStickyBar() {
  const { buyNow, addToCart } = useCart();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling past 400px
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-brand-surface/95 backdrop-blur-lg border-t border-brand-border p-3 shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center gap-3">
        <div className="flex flex-col pl-1">
          <span className="text-[10px] text-brand-text-muted uppercase tracking-wider">ক্যাশ অন ডেলিভারি</span>
          <span className="text-lg font-black text-brand-gold font-display leading-tight">
            ৳{PRODUCT_PRICE.toLocaleString("bn-BD")}
          </span>
        </div>

        <div className="flex-1 flex items-center gap-2">
          <button
            onClick={() => addToCart(1)}
            className="p-3 rounded-xl bg-brand-card border border-brand-border text-brand-text hover:border-brand-gold/40 flex-shrink-0"
            aria-label="কার্টে যোগ করুন"
          >
            <ShoppingBag className="w-5 h-5 text-brand-gold" />
          </button>

          <button
            onClick={() => buyNow(1)}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gold-gradient text-black font-extrabold text-sm shadow-gold active:scale-95 transition-transform"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>এখনই অর্ডার করুন (COD)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
