"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQS } from "@/lib/constants";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-brand-bg relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-brand-gold uppercase">
            সাধারণ জিজ্ঞাসা ও উত্তর
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-text font-display mt-2">
            আপনার মনে কি কোনো প্রশ্ন আছে?
          </h2>
          <p className="text-sm sm:text-base text-brand-text-muted mt-3">
            FORCE FUEL পণ্য, উপাদান, ডেলিভারি এবং অর্ডার সংক্রান্ত বহুল জিজ্ঞাসিত প্রশ্নগুলোর স্পষ্ট উত্তর জানুন।
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="rounded-2xl bg-brand-surface border border-brand-border overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-base sm:text-lg text-brand-text pr-4">
                    {faq.question}
                  </span>
                  <div
                    className={`p-1.5 rounded-full bg-brand-card border border-brand-border flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-brand-gold border-brand-gold/40" : "text-brand-text-muted"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 pt-1 text-sm text-brand-text-muted leading-relaxed border-t border-brand-border/40">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
