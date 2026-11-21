"use client";

import React from "react";
import { ShieldCheck, Sparkles, PackageCheck, Truck, Activity } from "lucide-react";
import { motion } from "framer-motion";

const highlights = [
  {
    icon: Sparkles,
    badge: "মূল উপাদান",
    title: "G115® জিনসেং এক্সট্রাক্ট",
    description:
      "স্ট্যান্ডার্ডাইজড প্যানাক্স জিনসেং যা শরীরের স্বাভাবিক ক্লান্তি কমিয়ে কাজের উদ্যম, এনার্জি ও দীর্ঘস্থায়ী সহনশীলতা রক্ষা করতে সাহায্য করে।",
  },
  {
    icon: Activity,
    badge: "মূল উপাদান",
    title: "KSM-66® অশ্বগন্ধা",
    description:
      "বিশ্বমানের ফুল-স্পেকট্রাম অশ্বগন্ধা রুট এক্সট্রাক্ট, যা মানসিক চাপ প্রশমিত করে শারীরিক শক্তি ও ভাইটালিটি ধরে রাখতে প্রস্তুত।",
  },
  {
    icon: PackageCheck,
    badge: "পূর্ণ বোতল",
    title: "প্রতি বোতলে ৬০ ডোজ",
    description:
      "প্রতিটি ইউভি-সুরক্ষিত সিল্ড জারে রয়েছে পূর্ণ ৬০ ডোজ পুষ্টিকর ক্যাপসুল, যা দীর্ঘমেয়াদী অবিচ্ছিন্ন ব্যবহারের জন্য আদর্শ।",
  },
  {
    icon: Truck,
    badge: "ঝুঁকিমুক্ত",
    title: "সারা দেশে ক্যাশ অন ডেলিভারি",
    description:
      "অগ্রিম কোনো টাকা দিতে হবে না। ডেলিভারিম্যান থেকে পার্সেল দেখে সিল পরীক্ষা করে তারপর সম্পূর্ণ মূল্য পরিশোধ করবেন।",
  },
];

export function ProductHighlights() {
  return (
    <section className="py-20 bg-brand-surface relative overflow-hidden border-y border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest text-brand-gold uppercase">
            ভেরিফায়েড প্যাকেজিং মানদণ্ড
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-text font-display mt-2">
            সর্বোচ্চ মানের পুরুষদের শক্তি ও সহনশীলতা
          </h2>
          <p className="text-sm sm:text-base text-brand-text-muted mt-3">
            প্যাকেজিংয়ে উল্লিখিত আসল ফর্মুলেশন ভিত্তিক পুষ্টি উপাদান—কোনো মিথ্যা প্রতিশ্রুতি বা অবাস্তব দাবি ব্যতিরেকে নির্ভরযোগ্য সাপোর্ট।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative p-5 sm:p-6 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-borderGold transition-all duration-300 hover:shadow-luxury group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-surface to-brand-bg border border-brand-border flex items-center justify-center group-hover:border-brand-gold/40 transition-colors">
                      <Icon className="w-6 h-6 text-brand-gold" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-bg border border-brand-border text-brand-text-muted">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-brand-text group-hover:text-brand-gold transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-brand-text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-brand-border/60 flex items-center gap-1.5 text-xs text-brand-gold font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ল্যাব স্ট্যান্ডার্ডাইজড ফর্মুলেশন</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
