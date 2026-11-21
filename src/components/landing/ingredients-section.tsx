"use client";

import React from "react";
import { Shield, Leaf, CheckCircle } from "lucide-react";
import { VERIFIED_INGREDIENTS } from "@/lib/constants";

export function IngredientsSection() {
  return (
    <section id="ingredients" className="py-20 bg-brand-bg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-brand-gold uppercase">
            কার্যকরী হার্বাল উপাদানসমূহ
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-text font-display mt-2">
            প্যাকেজিংয়ে প্রমাণিত আসল উপাদান
          </h2>
          <p className="text-sm sm:text-base text-brand-text-muted mt-3">
            বোতল এবং প্যাকেটের গায়ে উল্লেখিত আসল ও মানসম্পন্ন নির্যাস দ্বারা তৈরি। এতে কোনো রাসায়নিক ভেজাল বা অপ্রকাশিত উদ্দীপক নেই।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {VERIFIED_INGREDIENTS.map((ingredient) => (
            <div
              key={ingredient.name}
              className="relative p-8 rounded-3xl bg-brand-surface border border-brand-border hover:border-brand-borderGold transition-all duration-300 shadow-luxury group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-card to-black border border-brand-border flex items-center justify-center group-hover:border-brand-gold/40 transition-colors">
                  <Leaf className="w-7 h-7 text-brand-gold" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-purple/20 border border-brand-purple/40 text-brand-text">
                  {ingredient.badge}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-brand-text font-display mb-1 group-hover:text-brand-gold transition-colors">
                {ingredient.name}
              </h3>
              <p className="text-xs font-semibold text-brand-gold mb-4 uppercase tracking-wider">
                {ingredient.source}
              </p>

              <p className="text-sm text-brand-text-muted leading-relaxed">
                {ingredient.description}
              </p>

              <div className="mt-6 pt-4 border-t border-brand-border/60 flex items-center gap-2 text-xs text-brand-text-dim">
                <CheckCircle className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <span>আন্তর্জাতিক স্ট্যান্ডার্ডাইজড প্রক্রিয়ায় নিষ্কাশিত ও নিয়ন্ত্রিত</span>
              </div>
            </div>
          ))}
        </div>

        {/* Responsible Notice Banner */}
        <div className="max-w-4xl mx-auto mt-12 p-5 rounded-2xl bg-brand-card border border-brand-border flex items-start gap-3.5 text-xs text-brand-text-muted">
          <Shield className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-brand-text font-semibold">উপাদান সম্পর্কিত তথ্য:</strong> ওপরে উল্লিখিত উপাদানসমূহ পণ্যের বোতল ও কার্টনের গায়ে স্পষ্ট মুদ্রিত বর্ণনার (G115® এবং KSM-66®) ভিত্তিতে তুলে ধরা হয়েছে। FORCE FUEL কঠোর স্বচ্ছতা নীতি মেনে চলে। কোনো কৃত্রিম বা মিথ্যা শারীরিক পরিবর্তনের আশ্বাস আমরা দেই না।
          </p>
        </div>
      </div>
    </section>
  );
}
