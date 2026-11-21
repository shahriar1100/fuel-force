"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  PhoneCall,
} from "lucide-react";
import { BRAND_NAME, DEFAULT_SETTINGS } from "@/lib/constants";
import { ThemeToggle } from "@/components/ui/theme-toggle";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const [copied, setCopied] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders?orderNumber=${encodeURIComponent(orderNumber)}`);
        const data = await res.json();
        if (data.success && data.order) {
          setOrderDetails(data.order);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  const copyToClipboard = () => {
    if (orderNumber) {
      navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-brand-border">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-brand-text-muted hover:text-brand-gold transition-colors"
          >
            ← মূল পেজে ফিরে যান
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-base text-brand-text tracking-widest font-display">
              {BRAND_NAME}
            </span>
            <ThemeToggle />
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5 shadow-luxury">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <span className="text-xs font-bold tracking-widest text-brand-gold uppercase">
            অর্ডার সফল হয়েছে
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-text font-display mt-1">
            ধন্যবাদ! আপনার অর্ডারটি গৃহীত হয়েছে
          </h1>
          <p className="text-sm sm:text-base text-brand-text-muted mt-2 max-w-lg mx-auto">
            <strong className="text-brand-text">{BRAND_NAME}</strong> এর জন্য আপনার অর্ডারটি আমাদের সিস্টেমে যুক্ত হয়েছে। আমাদের টিম পার্সেলটি প্যাক করে কুরিয়ারে পাঠানোর প্রস্তুতি নিচ্ছে।
          </p>
        </div>

        {/* Order ID Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-brand-surface border border-brand-borderGold shadow-luxury mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-brand-card border border-brand-border mb-6">
            <div>
              <p className="text-xs text-brand-text-muted uppercase tracking-wider font-semibold">
                আপনার ইউনিক অর্ডার নাম্বার
              </p>
              <p className="text-2xl font-black text-brand-gold font-mono tracking-wider mt-0.5">
                {orderNumber || "FF-CONFIRMED"}
              </p>
            </div>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-surface border border-brand-border hover:border-brand-gold/40 text-brand-text text-xs font-bold transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-brand-gold" />
                  <span>আইডি কপি করুন</span>
                </>
              )}
            </button>
          </div>

          {/* Details breakdown */}
          {orderDetails && (
            <div className="space-y-4 pt-2 border-t border-brand-border">
              <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider">
                ডেলিভারি ও অর্ডারের বিবরণ
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3.5 rounded-xl bg-brand-card border border-brand-border">
                  <p className="text-xs text-brand-text-muted">গ্রাহকের নাম</p>
                  <p className="font-semibold text-brand-text mt-0.5">
                    {orderDetails.customer?.name || "Customer"}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-brand-card border border-brand-border">
                  <p className="text-xs text-brand-text-muted">মোবাইল নাম্বার</p>
                  <p className="font-semibold text-brand-text mt-0.5">
                    {orderDetails.customer?.phone || ""}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-brand-card border border-brand-border text-sm">
                <p className="text-xs text-brand-text-muted">ডেলিভারি ঠিকানা</p>
                <p className="font-semibold text-brand-text mt-0.5">
                  {orderDetails.customer?.full_address}, {orderDetails.customer?.district}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-brand-surface border border-brand-border space-y-2 text-sm">
                <div className="flex justify-between text-brand-text-muted">
                  <span>পণ্যের মূল্য</span>
                  <span className="text-brand-text font-medium">৳{orderDetails.subtotal}</span>
                </div>
                <div className="flex justify-between text-brand-text-muted">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="text-brand-text font-medium">৳{orderDetails.delivery_charge}</span>
                </div>
                <div className="border-t border-brand-border pt-2 flex justify-between font-bold text-base">
                  <span className="text-brand-text">পরিশোধযোগ্য টাকা (ক্যাশ অন ডেলিভারি)</span>
                  <span className="text-brand-gold text-xl font-display">
                    ৳{orderDetails.total_amount}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* What happens next instructions */}
          <div className="mt-6 pt-6 border-t border-brand-border space-y-3">
            <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">
              পরবর্তী ধাপসমূহ কী?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-brand-text-muted">
              <div className="p-3 rounded-xl bg-brand-card border border-brand-border">
                <span className="font-bold text-brand-text block mb-1">১. কনফার্মেশন কল</span>
                আমাদের প্রতিনিধি আপনার মোবাইল নাম্বারে কল করে ঠিকানা ও অর্ডার কনফার্ম করবেন।
              </div>
              <div className="p-3 rounded-xl bg-brand-card border border-brand-border">
                <span className="font-bold text-brand-text block mb-1">২. দ্রুত পার্সেল হ্যান্ডওভার</span>
                সিকিউরিটি সিল সহ নিরাপদে প্যাকেজিং করে কুরিয়ার পার্টনারের কাছে বুঝিয়ে দেওয়া হবে।
              </div>
              <div className="p-3 rounded-xl bg-brand-card border border-brand-border">
                <span className="font-bold text-brand-text block mb-1">৩. পণ্য পেয়ে মূল্য পরিশোধ</span>
                ডেলিভারিম্যানের কাছ থেকে পণ্য বুঝে নিয়ে ও চেক করে সরাসরি ক্যাশ পরিশোধ করুন।
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl bg-gold-gradient text-black font-extrabold text-sm shadow-gold hover:bg-gold-gradient-hover transition-all"
          >
            <span>মূল পেজে ফিরে যান</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={`tel:${DEFAULT_SETTINGS.contact_phone}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-brand-surface border border-brand-border hover:border-brand-gold/40 text-brand-text font-semibold text-sm transition-colors"
          >
            <PhoneCall className="w-4 h-4 text-brand-gold" />
            <span>সাপোর্ট কল: {DEFAULT_SETTINGS.contact_phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-bg flex items-center justify-center text-brand-gold">
          লোড হচ্ছে...
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
