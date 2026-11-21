"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/cart-context";

export function CartDrawer() {
  const { item, isOpen, closeCart, updateQuantity, removeFromCart, subtotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-brand-surface border-l border-brand-border flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-brand-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-gold" />
                <h3 className="font-semibold text-lg text-brand-text">আপনার শপিং ব্যাগ</h3>
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-brand-text-muted hover:text-brand-text hover:bg-white/5 rounded-full transition-colors"
                aria-label="কার্ট বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {!item ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-brand-card flex items-center justify-center mb-4 border border-brand-border">
                    <ShoppingBag className="w-8 h-8 text-brand-text-dim" />
                  </div>
                  <p className="text-brand-text font-medium text-lg mb-1">আপনার কার্ট বর্তমানে খালি</p>
                  <p className="text-brand-text-muted text-sm mb-6 max-w-xs">
                    FORCE FUEL এর সাথে আজই আপনার প্রাকৃতিক স্ট্যামিনা ও শক্তি পুনরুদ্ধার করুন।
                  </p>
                  <button
                    onClick={closeCart}
                    className="px-6 py-2.5 rounded-lg border border-brand-gold/40 text-brand-gold hover:bg-brand-gold/10 font-medium text-sm transition-colors"
                  >
                    পণ্যটি দেখুন
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 rounded-xl bg-brand-card border border-brand-border">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-brand-surface flex-shrink-0 border border-brand-border">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-brand-text leading-tight truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={removeFromCart}
                          className="text-brand-text-muted hover:text-red-400 p-1 transition-colors"
                          title="কার্ট থেকে মুছুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-brand-gold font-bold mt-1 text-base">
                        ৳{item.price.toLocaleString("bn-BD")}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-brand-border rounded-lg bg-brand-surface overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.quantity - 1)}
                            className="p-1.5 hover:bg-brand-cardHover text-brand-text-muted hover:text-brand-text transition-colors"
                            aria-label="পরিমাণ কমান"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-brand-text">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.quantity + 1)}
                            className="p-1.5 hover:bg-brand-cardHover text-brand-text-muted hover:text-brand-text transition-colors"
                            aria-label="পরিমাণ বাড়ান"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-medium text-brand-text">
                          ৳{(item.price * item.quantity).toLocaleString("bn-BD")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-brand-purple/15 border border-brand-purple/30 text-xs text-brand-text-muted flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
                    <span>সারা বাংলাদেশে ক্যাশ অন ডেলিভারি (COD) সুবিধা রয়েছে।</span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {item && (
              <div className="p-5 border-t border-brand-border bg-brand-card/70 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-brand-text-muted">
                    <span>পণ্যের মূল্য (সাবটোটাল)</span>
                    <span className="text-brand-text font-medium">৳{subtotal.toLocaleString("bn-BD")}</span>
                  </div>
                  <div className="flex justify-between text-brand-text-muted text-xs">
                    <span>ডেলিভারি চার্জ</span>
                    <span className="text-brand-text-dim">চেকআউটে নির্ধারিত হবে (৳৭০/৳১৩০)</span>
                  </div>
                  <div className="border-t border-brand-border pt-2 flex justify-between font-bold text-base text-brand-text">
                    <span>মোট প্রদেয়</span>
                    <span className="text-brand-gold text-lg">৳{subtotal.toLocaleString("bn-BD")}</span>
                  </div>
                </div>

                <Link
                  href={`/checkout?qty=${item.quantity}`}
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-black font-bold shadow-gold transition-all duration-200"
                >
                  <span>অর্ডার করতে এগিয়ে যান</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
