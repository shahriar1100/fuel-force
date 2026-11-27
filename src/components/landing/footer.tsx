"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Phone, MessageSquare, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BRAND_NAME, PRODUCT_NAME, PRODUCT_NAME_BN, DEFAULT_SETTINGS } from "@/lib/constants";

interface FooterProps {
  settings?: Partial<typeof DEFAULT_SETTINGS>;
}

export function Footer({ settings }: FooterProps) {
  const [activeModal, setActiveModal] = useState<"privacy" | "terms" | "delivery" | null>(null);

  const phone = settings?.contact_phone || DEFAULT_SETTINGS.contact_phone;
  const whatsapp = settings?.whatsapp_number || DEFAULT_SETTINGS.whatsapp_number;
  const deliveryInside = settings?.delivery_charge_inside_dhaka ?? DEFAULT_SETTINGS.delivery_charge_inside_dhaka;
  const deliveryOutside = settings?.delivery_charge_outside_dhaka ?? DEFAULT_SETTINGS.delivery_charge_outside_dhaka;

  return (
    <>
      <footer id="contact" className="bg-brand-surface border-t border-brand-border py-8 sm:py-10 text-xs text-brand-text-muted transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Main Compact Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-5 pb-6 border-b border-brand-border">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-gold to-brand-purple flex items-center justify-center p-0.5 shadow-gold">
                <div className="w-full h-full bg-brand-bg rounded-[7px] flex items-center justify-center">
                  <span className="text-brand-gold font-black tracking-wider text-xs">FF</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold tracking-widest text-base text-brand-text font-display">
                  {BRAND_NAME}
                </span>
                <span className="text-[9px] tracking-widest text-brand-gold uppercase font-semibold">
                  {PRODUCT_NAME_BN}
                </span>
              </div>
            </div>

            {/* Quick Contact & Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-xs font-semibold text-brand-text transition-colors group"
              >
                <Phone className="w-3.5 h-3.5 text-brand-gold group-hover:scale-110 transition-transform" />
                <span>{phone}</span>
              </a>

              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-xs font-semibold text-brand-text transition-colors group"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
                <span>হোয়াটসঅ্যাপ</span>
              </a>

              <Link
                href="/checkout?qty=1"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gold-gradient text-black font-extrabold text-xs shadow-gold hover:bg-gold-gradient-hover transition-all"
              >
                <span>অর্ডার করুন (COD)</span>
              </Link>
            </div>

            {/* Quick Navigation Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
              <a href="#product-details" className="text-brand-text-muted hover:text-brand-gold transition-colors">
                পণ্য বিবরণ
              </a>
              <a href="#gallery" className="text-brand-text-muted hover:text-brand-gold transition-colors">
                গ্যালারি
              </a>
              <a href="#faq" className="text-brand-text-muted hover:text-brand-gold transition-colors">
                সাধারণ প্রশ্ন (FAQ)
              </a>
            </div>
          </div>

          {/* Bottom Bar: Legal Modals + Copyright + Theme Toggle */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-brand-text-dim">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setActiveModal("privacy")}
                className="hover:text-brand-gold transition-colors underline"
              >
                গোপনীয়তা নীতি
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveModal("terms")}
                className="hover:text-brand-gold transition-colors underline"
              >
                শর্তাবলী
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveModal("delivery")}
                className="hover:text-brand-gold transition-colors underline"
              >
                ডেলিভারি ও রিটার্ন
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <span>© {new Date().getFullYear()} {BRAND_NAME}. সর্বস্বত্ব সংরক্ষিত।</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </footer>

      {/* Policy Modals in Bengali */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-2xl max-h-[85vh] bg-brand-surface border border-brand-border rounded-2xl p-4 sm:p-8 overflow-y-auto shadow-2xl">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-brand-card hover:bg-brand-cardHover text-brand-text-muted hover:text-brand-text transition-colors"
              aria-label="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === "privacy" && (
              <div className="space-y-4 text-sm text-brand-text-muted">
                <h3 className="text-xl font-bold text-brand-text font-display">গোপনীয়তা নীতি (Privacy Policy)</h3>
                <p>
                  FORCE FUEL-এ আমরা আপনার ব্যক্তিগত তথ্যের গোপনীয়তাকে সর্বোচ্চ গুরুত্ব দিয়ে থাকি। আপনার নাম, মোবাইল নাম্বার এবং ডেলিভারি ঠিকানা শুধুমাত্র আপনার পার্সেল পাঠানো ও অর্ডার ভেরিফিকেশনের কাজে ব্যবহার করা হয়।
                </p>
                <p>
                  আমরা কখনোই কোনো গ্রাহকের তথ্য তৃতীয় পক্ষের কাছে বিক্রি বা শেয়ার করি না। শুধুমাত্র ডেলিভারি সম্পন্ন করার সুবিধার্থে অনুমোদিত কুরিয়ার পার্টনারের সাথে প্রয়োজনীয় তথ্য শেয়ার করা হয়।
                </p>
                <p>
                  আমাদের সমস্ত ডেটা আধুনিক এনক্রিপশন ও উচ্চমানের নিরাপত্তা প্রটোকল দ্বারা সুরক্ষিত।
                </p>
              </div>
            )}

            {activeModal === "terms" && (
              <div className="space-y-4 text-sm text-brand-text-muted">
                <h3 className="text-xl font-bold text-brand-text font-display">শর্তাবলী (Terms & Conditions)</h3>
                <p>
                  এই ওয়েবসাইটে অর্ডার করার মাধ্যমে আপনি নিশ্চিত করছেন যে আপনার বয়স কমপক্ষে ১৮ বছর বা তার বেশি এবং আপনি ক্যাশ অন ডেলিভারি শর্ত মেনে পণ্যটি ক্রয় করছেন।
                </p>
                <p>
                  অর্ডার প্রদানকালে সঠিক নাম, মোবাইল নাম্বার ও পূর্ণাঙ্গ ঠিকানা প্রদান করা আবশ্যক। পার্সেল পাঠানোর পূর্বে আমাদের সাপোর্ট টিম থেকে ফোন কলের মাধ্যমে ঠিকানা নিশ্চিত করা হতে পারে।
                </p>
                <p>
                  FORCE FUEL একটি ডায়েটারি সাপ্লিমেন্ট হিসেবে বিক্রি করা হয়। ওয়েবসাইটের কোনো বক্তব্যই বিশেষজ্ঞ চিকিৎসকের পরামর্শের বিকল্প নয়।
                </p>
              </div>
            )}

            {activeModal === "delivery" && (
              <div className="space-y-4 text-sm text-brand-text-muted">
                <h3 className="text-xl font-bold text-brand-text font-display">ডেলিভারি ও রিটার্ন পলিসি</h3>
                <p>
                  <strong>ডেলিভারি এরিয়া:</strong> আমরা সমগ্র বাংলাদেশের ৬৪টি জেলায় দ্রুত ও নিরাপদ হোম ডেলিভারি প্রদান করি।
                </p>
                <p>
                  <strong>ডেলিভারি চার্জ:</strong> ঢাকা সিটি কর্পোরেশনের ভেতরে ডেলিভারি চার্জ মাত্র ৳{deliveryInside.toLocaleString("bn-BD")} (২৪-৪৮ ঘণ্টার মধ্যে ডেলিভারি)। ঢাকা সিটির বাইরে সারা দেশে ডেলিভারি চার্জ ৳{deliveryOutside.toLocaleString("bn-BD")} (৪৮-৭২ ঘণ্টার মধ্যে ডেলিভারি)।
                </p>
                <p>
                  <strong>প্যাকেট চেক ও রিটার্ন:</strong> ডেলিভারিম্যান উপস্থিত থাকা অবস্থায় প্যাকেটের মূল সিল অক্ষত আছে কি না তা দেখে মূল্য পরিশোধ করতে পারবেন। যদি কোনো কারণে বোতলের সিল ভাঙা থাকে, তবে পণ্যটি তাৎক্ষণিক কোনো খরচ ছাড়াই ফেরত পাঠাতে পারবেন। স্বাস্থ্য সুরক্ষার স্বার্থে একবার সিল খোলা বা ব্যবহৃত সাপ্লিমেন্ট বোতল ফেরত নেওয়া হয় না।
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
