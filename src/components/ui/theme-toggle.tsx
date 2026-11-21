"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/theme-context";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-xl border border-brand-border bg-brand-surface opacity-50 ${className}`}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative p-2 rounded-xl bg-brand-surface border border-brand-border hover:border-brand-gold/40 text-brand-text hover:text-brand-gold transition-all duration-200 shadow-sm ${className}`}
      aria-label={isDark ? "লাইট মোড চালু করুন" : "ডার্ক মোড চালু করুন"}
      title={isDark ? "লাইট মোড চালু করুন" : "ডার্ক মোড চালু করুন"}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-brand-gold animate-in spin-in-180 duration-300" />
        ) : (
          <Moon className="w-4 h-4 text-brand-purple animate-in spin-in-180 duration-300" />
        )}
      </div>
    </button>
  );
}
