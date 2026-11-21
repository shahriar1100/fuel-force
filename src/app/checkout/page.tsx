"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  CheckCircle,
  Plus,
  Minus,
  Banknote,
  AlertCircle,
  Lock,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { checkoutSchema, CheckoutSchemaType } from "@/lib/validation";
import {
  BRAND_NAME,
  PRODUCT_NAME,
  PRODUCT_NAME_BN,
  PRODUCT_PRICE,
  DEFAULT_SETTINGS,
  BANGLADESH_DISTRICTS,
  INITIAL_PRODUCT_IMAGES,
} from "@/lib/constants";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQty = parseInt(searchParams.get("qty") || "1", 10);
  const [quantity, setQuantity] = useState(isNaN(initialQty) || initialQty < 1 ? 1 : initialQty);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutSchemaType>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      phone: "",
      district: "Dhaka",
      fullAddress: "",
      quantity: quantity,
    },
  });

  const selectedDistrict = watch("district");
  const isDhaka = (selectedDistrict || "").trim().toLowerCase() === "dhaka";
  const deliveryCharge = isDhaka
    ? DEFAULT_SETTINGS.delivery_charge_inside_dhaka
    : DEFAULT_SETTINGS.delivery_charge_outside_dhaka;

  const subtotal = PRODUCT_PRICE * quantity;
  const totalAmount = subtotal + deliveryCharge;

  const onSubmit = async (data: CheckoutSchemaType) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          quantity,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "অর্ডার সম্পন্ন করতে সমস্যা হয়েছে");
      }

      // Order placed successfully! Clear cart & navigate to confirmation page
      try {
        localStorage.removeItem("force_fuel_cart");
      } catch {}

      router.push(`/order-confirmation?orderNumber=${encodeURIComponent(result.orderNumber)}`);
    } catch (err: any) {
      setServerError(err.message || "অর্ডার প্রক্রিয়াকরণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Back Nav & Logo */}
        <div className="flex items-center justify-between pb-8 border-b border-brand-border">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-brand-text-muted hover:text-brand-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>মূল পেজে ফিরে যান</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="font-extrabold text-lg text-brand-text tracking-widest font-display">
              {BRAND_NAME}
            </span>
          </div>
        </div>

        <div className="pt-8 mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text font-display">
            সহজ হোম ডেলিভারি চেকআউট
          </h1>
          <p className="text-sm text-brand-text-muted mt-1">
            ক্যাশ অন ডেলিভারি। পণ্য হাতে পেয়ে ও প্যাকেট দেখে মূল্য পরিশোধ করবেন।
          </p>
        </div>

        {serverError && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Customer Delivery Form */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-brand-surface border border-brand-border shadow-luxury space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-brand-border">
                  <h2 className="text-lg font-bold text-brand-text">১. ডেলিভারির তথ্য</h2>
                  <span className="text-xs text-brand-gold font-semibold uppercase">
                    ধাপ ১ / ২
                  </span>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-brand-text-muted mb-2 uppercase tracking-wider">
                    আপনার পূর্ণ নাম <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    placeholder="যেমন: তানভীর আহমেদ"
                    className={`w-full px-4 py-3.5 rounded-xl bg-brand-card border text-brand-text placeholder-brand-text-dim text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold transition-all ${
                      errors.name ? "border-red-500" : "border-brand-border"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400 mt-1.5">{errors.name.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-brand-text-muted mb-2 uppercase tracking-wider">
                    মোবাইল নাম্বার (১১ ডিজিট) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    placeholder="যেমন: 01712345678"
                    className={`w-full px-4 py-3.5 rounded-xl bg-brand-card border text-brand-text placeholder-brand-text-dim text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold transition-all ${
                      errors.phone ? "border-red-500" : "border-brand-border"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-400 mt-1.5">{errors.phone.message}</p>
                  )}
                  <p className="text-[11px] text-brand-text-dim mt-1">
                    ডেলিভারিম্যান পৌঁছানোর পূর্বে এই নাম্বারে কল করে নিশ্চিত করবেন।
                  </p>
                </div>

                {/* District */}
                <div>
                  <label className="block text-xs font-semibold text-brand-text-muted mb-2 uppercase tracking-wider">
                    ডেলিভারি জেলা <span className="text-red-400">*</span>
                  </label>
                  <select
                    {...register("district")}
                    className={`w-full px-4 py-3.5 rounded-xl bg-brand-card border text-brand-text text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold transition-all ${
                      errors.district ? "border-red-500" : "border-brand-border"
                    }`}
                  >
                    <option value="Dhaka">ঢাকা (৳৭০ ডেলিভারি চার্জ)</option>
                    <option disabled className="bg-brand-border text-brand-text-dim">
                      ── ঢাকার বাইরে (৳১৩০ ডেলিভারি চার্জ) ──
                    </option>
                    {BANGLADESH_DISTRICTS.filter((d) => d !== "Dhaka").map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                  {errors.district && (
                    <p className="text-xs text-red-400 mt-1.5">{errors.district.message}</p>
                  )}
                </div>

                {/* Full Address */}
                <div>
                  <label className="block text-xs font-semibold text-brand-text-muted mb-2 uppercase tracking-wider">
                    সম্পূর্ণ ডেলিভারি ঠিকানা <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    {...register("fullAddress")}
                    placeholder="বাসা নং, রোড নং, এলাকা এবং নিকটস্থ পরিচিত ল্যান্ডমার্ক"
                    className={`w-full px-4 py-3.5 rounded-xl bg-brand-card border text-brand-text placeholder-brand-text-dim text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold transition-all ${
                      errors.fullAddress ? "border-red-500" : "border-brand-border"
                    }`}
                  />
                  {errors.fullAddress && (
                    <p className="text-xs text-red-400 mt-1.5">{errors.fullAddress.message}</p>
                  )}
                </div>
              </div>

              {/* Payment Method Section: Cash on Delivery ONLY */}
              <div className="p-6 rounded-3xl bg-brand-surface border border-brand-border space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                  <h2 className="text-lg font-bold text-brand-text">২. পেমেন্ট পদ্ধতি</h2>
                  <span className="text-xs text-brand-gold font-semibold uppercase">ক্যাশ অন ডেলিভারি</span>
                </div>

                <div className="p-4 rounded-2xl bg-brand-card border-2 border-brand-gold/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-gold/15 flex items-center justify-center">
                      <Banknote className="w-5 h-5 text-brand-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-text">ক্যাশ অন ডেলিভারি (COD)</p>
                      <p className="text-xs text-brand-text-muted">
                        পার্সেল হাতে পাওয়ার পর ডেলিভারিম্যানকে মূল্য পরিশোধ করবেন।
                      </p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-brand-gold flex-shrink-0" />
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Confirm Button */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-8 rounded-3xl bg-brand-surface border border-brand-borderGold shadow-luxury sticky top-28 space-y-6">
                <h2 className="text-lg font-bold text-brand-text pb-4 border-b border-brand-border">
                  অর্ডার বিবরণী
                </h2>

                {/* Product Item */}
                <div className="flex gap-4 items-center">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-brand-card border border-brand-border flex-shrink-0">
                    <Image
                      src={INITIAL_PRODUCT_IMAGES[0].url}
                      alt="FORCE FUEL Eagle Endurance"
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-brand-text truncate">
                      {BRAND_NAME}
                    </h3>
                    <p className="text-xs text-brand-text-muted">{PRODUCT_NAME_BN}</p>
                    <p className="text-sm font-bold text-brand-gold mt-1">
                      ৳{PRODUCT_PRICE.toLocaleString("bn-BD")}
                    </p>
                  </div>
                </div>

                {/* Quantity Control on Checkout */}
                <div className="p-3 rounded-xl bg-brand-card border border-brand-border flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-text">পরিমাণ:</span>
                  <div className="flex items-center border border-brand-border rounded-lg bg-brand-surface overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-1.5 hover:bg-brand-cardHover text-brand-text-muted hover:text-brand-text transition-colors"
                      aria-label="পরিমাণ কমান"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-brand-text">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                      className="p-1.5 hover:bg-brand-cardHover text-brand-text-muted hover:text-brand-text transition-colors"
                      aria-label="পরিমাণ বাড়ান"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-xs font-bold text-brand-text">
                    ৳{subtotal.toLocaleString("bn-BD")}
                  </span>
                </div>

                {/* Pricing Line Items */}
                <div className="space-y-3 pt-2 text-sm border-t border-brand-border">
                  <div className="flex justify-between text-brand-text-muted">
                    <span>পণ্যের মূল্য ({quantity} টি বোতল)</span>
                    <span className="text-brand-text font-medium">৳{subtotal.toLocaleString("bn-BD")}</span>
                  </div>

                  <div className="flex justify-between text-brand-text-muted">
                    <div className="flex items-center gap-1.5">
                      <span>ডেলিভারি চার্জ</span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-brand-card border border-brand-border text-brand-gold">
                        {isDhaka ? "ঢাকার ভেতরে" : "ঢাকার বাইরে"}
                      </span>
                    </div>
                    <span className="text-brand-text font-medium">৳{deliveryCharge}</span>
                  </div>

                  <div className="border-t border-brand-border pt-3 flex justify-between items-baseline font-bold">
                    <span className="text-base text-brand-text">সর্বমোট প্রদেয়</span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-brand-gold font-display">
                        ৳{totalAmount.toLocaleString("bn-BD")}
                      </span>
                      <p className="text-[10px] text-brand-text-dim">ক্যাশ অন ডেলিভারি</p>
                    </div>
                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-black font-extrabold text-base shadow-gold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>অর্ডার প্রসেস হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 fill-black" />
                      <span>অর্ডার নিশ্চিত করুন (৳{totalAmount.toLocaleString("bn-BD")})</span>
                    </>
                  )}
                </button>

                {/* Safety notes */}
                <div className="pt-2 flex flex-col gap-2 text-xs text-brand-text-dim">
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-brand-gold" />
                    <span>ঢাকার ভেতরে ২৪-৪৮ ঘণ্টা, ঢাকার বাইরে ৪৮-৭২ ঘণ্টার মধ্যে ডেলিভারি</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
                    <span>কোনো অনলাইন কার্ড বা অগ্রিম পেমেন্টের প্রয়োজন নেই</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-bg flex items-center justify-center text-brand-gold">
          লোড হচ্ছে...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
