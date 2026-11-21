"use client";

import React from "react";
import { AlertCircle, Clock, ShieldCheck, HeartPulse, CheckCircle2 } from "lucide-react";

export function ProductInfo() {
  return (
    <section id="product-info" className="py-20 bg-brand-surface relative border-y border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-brand-gold uppercase">
            নির্দেশিকা ও নিরাপত্তা সতর্কতা
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-text font-display mt-2">
            ব্যবহার বিধি ও সতর্কতা
          </h2>
          <p className="text-sm sm:text-base text-brand-text-muted mt-3">
            দায়িত্বশীল ও সঠিক ব্যবহারের সহজ নির্দেশনা। নিজের সুস্বাস্থ্য ও সুস্থতাকে সর্বদা অগ্রাধিকার দিন।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* Usage Protocol */}
          <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-brand-card border border-brand-border shadow-luxury flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-center">
                  <Clock className="w-6 h-6 text-brand-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-text font-display">সেবনের নিয়ম</h3>
                  <p className="text-xs text-brand-text-muted">দৈনন্দিন ডায়েটারি প্রটোকল</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-brand-text-muted">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-brand-text font-semibold">পদ্ধতি:</strong> বোতলের গায়ে মুদ্রিত নির্দেশিকা অনুযায়ী প্রতিদিন সুষম খাবার গ্রহণের পর পর্যাপ্ত পানি সহ সেব্য।
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-brand-text font-semibold">নিয়মানুবর্তিতা:</strong> সুষম খাদ্যতালিকা, স্বাস্থ্যকর ঘুম ও পর্যাপ্ত পানি পানের সাথে নিয়মিত ব্যবহার সুফল দেয়।
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-brand-text font-semibold">সংরক্ষণ:</strong> সরাসরি সূর্যালোক ও অতিরিক্ত তাপ থেকে দূরে ঠান্ডা ও শুষ্ক স্থানে সংরক্ষণ করুন। বোতলের ক্যাপ শক্ত করে লাগিয়ে রাখুন।
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-brand-border/60 text-xs text-brand-text-dim">
              প্রতি বোতলে ৬০ ডোজ। অতিরিক্ত মাত্রায় সেবন করবেন না।
            </div>
          </div>

          {/* Safety Warnings & Disclaimers */}
          <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-brand-card border border-brand-border shadow-luxury flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-brand-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-text font-display">নিরাপত্তা ও সতর্কতা</h3>
                  <p className="text-xs text-brand-text-muted">জরুরি স্বাস্থ্য সচেতনতা</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-brand-text-muted">
                <div className="flex items-start gap-3">
                  <HeartPulse className="w-5 h-5 text-brand-purple-light flex-shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-brand-text font-semibold">শুধুমাত্র প্রাপ্তবয়স্কদের জন্য:</strong> এটি কেবল ১৮ বছর বা তার বেশি বয়সী পুরুষদের জন্য। শিশুদের নাগালের বাইরে রাখুন।
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-brand-purple-light flex-shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-brand-text font-semibold">চিকিৎসকের পরামর্শ:</strong> যদি আপনার কোনো গুরুতর স্বাস্থ্য সমস্যা বা উচ্চ রক্তচাপ থাকে, তবে সেবনের পূর্বে চিকিৎসকের সাথে পরামর্শ করুন।
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-brand-purple-light flex-shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-brand-text font-semibold">সতর্কীকরণ:</strong> এটি একটি ফুড সাপ্লিমেন্ট। এটি কোনো রোগ নিরাময়, চিকিৎসা বা প্রতিরোধী ওষুধ হিসেবে বিবেচনা করা যাবে না।
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-brand-border/60 text-xs text-brand-text-dim">
              ভেতরের নিরাপত্তা সিল ছেঁড়া থাকলে সেবন করবেন না।
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
