"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Phone, MessageSquare, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BRAND_NAME, PRODUCT_NAME, PRODUCT_NAME_BN, DEFAULT_SETTINGS } from "@/lib/constants";

export function Footer() {
  const [activeModal, setActiveModal] = useState<"privacy" | "terms" | "delivery" | null>(null);

  return (
    <>
      <footer id="contact" className="bg-brand-surface border-t border-brand-border pt-16 pb-24 lg:pb-12 text-sm text-brand-text-muted transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-brand-border">
            {/* Column 1: Brand Info */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-gold to-brand-purple flex items-center justify-center p-0.5 shadow-gold">
                  <div className="w-full h-full bg-brand-bg rounded-[7px] flex items-center justify-center">
                    <span className="text-brand-gold font-black tracking-wider text-sm">FF</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold tracking-widest text-lg text-brand-text font-display">
                    {BRAND_NAME}
                  </span>
                  <span className="text-[10px] tracking-widest text-brand-gold uppercase font-semibold">
                    {PRODUCT_NAME_BN}
                  </span>
                </div>
              </div>

              <p className="text-sm leading-relaxed max-w-sm text-brand-text-muted">
                FORCE FUEL পুরুষদের শক্তি, স্ট্যামিনা ও সুস্থতা ধরে রাখার জন্য প্রিমিয়াম সাপ্লিমেন্ট। বিশ্বখ্যাত স্ট্যান্ডার্ডাইজড G115® প্যানাক্স জিনসেং ও KSM-66® অশ্বগন্ধা রুট এক্সট্রাক্ট এর সমন্বয়ে তৈরি।
              </p>

              <div className="pt-2 text-xs text-brand-text-dim">
                ৬০ ডোজ | ডায়েটারি সাপ্লিমেন্ট | সারা দেশে ক্যাশ অন ডেলিভারি
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-brand-text font-bold uppercase tracking-wider text-xs">
                প্রয়োজনীয় লিংক
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <a href="#product-details" className="text-brand-text-muted hover:text-brand-gold transition-colors">
                    পণ্য বিবরণ ও স্পেকস
                  </a>
                </li>
                <li>
                  <a href="#ingredients" className="text-brand-text-muted hover:text-brand-gold transition-colors">
                    আসল কার্যকরী উপাদান
                  </a>
                </li>
                <li>
                  <a href="#gallery" className="text-brand-text-muted hover:text-brand-gold transition-colors">
                    প্রোডাক্ট গ্যালারি
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-brand-text-muted hover:text-brand-gold transition-colors">
                    সাধারণ প্রশ্ন ও উত্তর
                  </a>
                </li>
                <li>
                  <Link href="/checkout?qty=1" className="text-brand-gold hover:underline font-semibold">
                    ক্যাশ অন ডেলিভারি চেকআউট
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact & Legal */}
            <div className="lg:col-span-4 space-y-4">
              <h4 className="text-brand-text font-bold uppercase tracking-wider text-xs">
                গ্রাহক সেবা ও যোগাযোগ
              </h4>

              <div className="space-y-3">
                <a
                  href={`tel:${DEFAULT_SETTINGS.contact_phone}`}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-brand-card border border-brand-border hover:border-brand-gold/40 transition-colors group"
                >
                  <Phone className="w-4 h-4 text-brand-gold flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-xs text-brand-text-dim">সরাসরি কল সেন্টার</p>
                    <p className="text-sm font-semibold text-brand-text">{DEFAULT_SETTINGS.contact_phone}</p>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${DEFAULT_SETTINGS.whatsapp_number.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-brand-card border border-brand-border hover:border-emerald-500/40 transition-colors group"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-xs text-brand-text-dim">হোয়াটসঅ্যাপ মেসেজ সহায়তা</p>
                    <p className="text-sm font-semibold text-brand-text">{DEFAULT_SETTINGS.whatsapp_number}</p>
                  </div>
                </a>
              </div>

              {/* Legal Links */}
              <div className="flex flex-wrap gap-4 pt-2 text-xs">
                <button
                  onClick={() => setActiveModal("privacy")}
                  className="text-brand-text-muted hover:text-brand-gold transition-colors underline"
                >
                  গোপনীয়তা নীতি (Privacy Policy)
                </button>
                <button
                  onClick={() => setActiveModal("terms")}
                  className="text-brand-text-muted hover:text-brand-gold transition-colors underline"
                >
                  শর্তাবলী (Terms & Conditions)
                </button>
                <button
                  onClick={() => setActiveModal("delivery")}
                  className="text-brand-text-muted hover:text-brand-gold transition-colors underline"
                >
                  ডেলিভারি ও রিটার্ন পলিসি
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar & Disclaimer */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-text-dim">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <p>© {new Date().getFullYear()} {BRAND_NAME}. সর্বস্বত্ব সংরক্ষিত।</p>
              <div className="flex items-center">
                <ThemeToggle />
              </div>
            </div>
            <p className="text-center md:text-right max-w-lg">
              সতর্কবার্তা: এটি একটি খাদ্যতালিকাগত সম্পূরক (Dietary Supplement)। এটি কোনো জটিল রোগ নির্ণয়, চিকিৎসা বা নিরাময়ের জন্য নির্দেশিত নয়।
            </p>
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
                  <strong>ডেলিভারি চার্জ:</strong> ঢাকা সিটি কর্পোরেশনের ভেতরে ডেলিভারি চার্জ মাত্র ৳৭০ (২৪-৪৮ ঘণ্টার মধ্যে ডেলিভারি)। ঢাকা সিটির বাইরে সারা দেশে ডেলিভারি চার্জ ৳১৩০ (৪৮-৭২ ঘণ্টার মধ্যে ডেলিভারি)।
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
