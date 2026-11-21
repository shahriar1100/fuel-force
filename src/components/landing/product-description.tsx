"use client";

import React from "react";
import Image from "next/image";
import { Check, Package, FileText } from "lucide-react";
import { PRODUCT_SPECS, INITIAL_PRODUCT_IMAGES } from "@/lib/constants";

export function ProductDescription() {
  return (
    <section id="product-details" className="py-20 bg-brand-bg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-brand-gold uppercase">
            পণ্য বিবরণ ও স্পেসিফিকেশন
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-text font-display mt-2">
            পুরুষদের স্ট্যামিনা ও সক্ষমতার বিশ্বস্ত প্রতীক
          </h2>
          <p className="text-sm sm:text-base text-brand-text-muted mt-3">
            FORCE FUEL – EAGLE ENDURANCE FOR MEN এর উপাদান, প্যাকেজিং নিরাপত্তা এবং স্পেসিফিকেশন এর সম্পূর্ণ তথ্য।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual packaging feature */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-brand-borderGold bg-brand-surface p-4 shadow-luxury">
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden">
                <Image
                  src={INITIAL_PRODUCT_IMAGES[1].url}
                  alt={INITIAL_PRODUCT_IMAGES[1].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>

              {/* Packaging feature overlay */}
              <div className="mt-4 p-4 rounded-xl bg-brand-card border border-brand-border">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-brand-gold flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-brand-text">টেম্পার-এভিডেন্ট সিকিউরিটি সিল</h4>
                    <p className="text-xs text-brand-text-muted">
                      আসল সতেজতা ও গুণমান রক্ষায় বোতলের ভেতরের মুখে ইনডাকশন সিল ও বাইরের নিরাপত্তা কার্টন বিদ্যমান।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Overview and Specifications Table */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-brand-text font-display">
                প্রতিদিনের কর্মক্ষমতা ও সক্রিয় জীবনযাপনের সহায়ক
              </h3>
              <p className="text-sm sm:text-base text-brand-text-muted leading-relaxed">
                FORCE FUEL – EAGLE ENDURANCE FOR MEN তৈরি হয়েছে সর্বোচ্চ মানের ঔষধি বোটানিক্যাল নির্যাসের মাধ্যমে। ফর্মুলায় অন্তর্ভুক্ত রয়েছে আসল G115® জিনসেং যা মানসিক সজাগতা ও ক্লান্তিহীন দৈহিক কর্মক্ষমতা বাড়াতে সহায়তা করে। সাথে রয়েছে ফুল-স্পেকট্রাম KSM-66® অশ্বগন্ধা রুট এক্সট্রাক্ট, যা পুরুষের স্বাভাবিক শারীরিক ও মানসিক ভারসাম্য রক্ষা করে।
              </p>
              <p className="text-sm sm:text-base text-brand-text-muted leading-relaxed">
                প্রতিটি বোতলে রয়েছে পূর্ণ ৬০ ডোজ, যা স্যাঁতসেঁতে ভাব ও রোদের ক্ষতিকর রশ্মি থেকে রক্ষায় ইউভি-সুরক্ষিত বোতলে সিল করা থাকে।
              </p>
            </div>

            {/* Specifications Card */}
            <div className="rounded-2xl bg-brand-surface border border-brand-border overflow-hidden">
              <div className="p-4 bg-brand-card border-b border-brand-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-gold" />
                  <span className="text-sm font-bold text-brand-text">প্রোডাক্ট স্পেসিফিকেশনস</span>
                </div>
                <span className="text-xs text-brand-gold font-semibold uppercase">ভেরিফায়েড অথেনটিক</span>
              </div>

              <div className="divide-y divide-brand-border/60">
                {PRODUCT_SPECS.map((spec) => (
                  <div
                    key={spec.label}
                    className="grid grid-cols-1 sm:grid-cols-12 p-3.5 sm:px-5 hover:bg-white/[0.02] transition-colors text-sm"
                  >
                    <span className="sm:col-span-4 font-medium text-brand-text-muted">
                      {spec.label}
                    </span>
                    <span className="sm:col-span-8 font-semibold text-brand-text mt-0.5 sm:mt-0">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Benefits from Packaging */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-brand-card border border-brand-purple/30 flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-brand-purple/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-brand-gold" />
                </div>
                <span className="text-xs font-semibold text-brand-text">লিবিডো বৃদ্ধি (Enhance Libido)</span>
              </div>
              <div className="p-3.5 rounded-xl bg-brand-card border border-brand-purple/30 flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-brand-purple/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-brand-gold" />
                </div>
                <span className="text-xs font-semibold text-brand-text">পারফরম্যান্স বুস্ট (Boost Performance)</span>
              </div>
              <div className="p-3.5 rounded-xl bg-brand-card border border-brand-purple/30 flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-brand-purple/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-brand-gold" />
                </div>
                <span className="text-xs font-semibold text-brand-text">সারাদিন ফ্রেশ ফিলিং (Stay Fresh)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
