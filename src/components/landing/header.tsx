"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, PhoneCall, Zap, Phone } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { BRAND_NAME, DEFAULT_SETTINGS } from "@/lib/constants";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface HeaderProps {
  settings?: {
    contact_phone?: string;
    whatsapp_number?: string;
    announcement_text?: string;
    announcement_enabled?: boolean;
  };
}

export function Header({ settings: initialSettings }: HeaderProps) {
  const { item, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [phone, setPhone] = useState(
    initialSettings?.contact_phone || DEFAULT_SETTINGS.contact_phone
  );
  const [announcementText, setAnnouncementText] = useState(
    initialSettings?.announcement_text ?? DEFAULT_SETTINGS.announcement_text
  );
  const [announcementEnabled, setAnnouncementEnabled] = useState(
    initialSettings?.announcement_enabled ?? DEFAULT_SETTINGS.announcement_enabled
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch live settings if not initially provided
  useEffect(() => {
    if (!initialSettings?.contact_phone) {
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.settings) {
            if (data.settings.contact_phone) setPhone(data.settings.contact_phone);
            if (data.settings.announcement_text !== undefined)
              setAnnouncementText(data.settings.announcement_text);
            if (data.settings.announcement_enabled !== undefined)
              setAnnouncementEnabled(data.settings.announcement_enabled);
          }
        })
        .catch(() => {});
    }
  }, [initialSettings]);

  const totalQuantity = item ? item.quantity : 0;

  const navLinks = [
    { label: "পণ্য বিবরণ", href: "#product-details" },
    { label: "গ্যালারি", href: "#gallery" },
    { label: "সাধারণ প্রশ্ন (FAQ)", href: "#faq" },
    { label: "যোগাযোগ", href: "#contact" },
  ];

  const cleanPhone = phone.replace(/[^0-9+]/g, "");

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* Top Announcement Bar (Configurable from Admin) */}
      {announcementEnabled && announcementText && (
        <div className="bg-gradient-to-r from-amber-500/20 via-brand-gold/25 to-amber-500/20 border-b border-brand-gold/30 backdrop-blur-md py-1.5 px-3 text-center text-[11px] sm:text-xs font-semibold text-brand-gold flex items-center justify-center gap-2">
          <Zap className="w-3 h-3 fill-brand-gold flex-shrink-0 animate-pulse" />
          <span className="truncate">{announcementText}</span>
          <a
            href={`tel:${cleanPhone}`}
            className="hidden sm:inline-flex items-center gap-1 ml-2 text-brand-text hover:text-white underline font-bold"
          >
            <Phone className="w-2.5 h-2.5" />
            <span>সরাসরি কল: {phone}</span>
          </a>
        </div>
      )}

      {/* Main Navbar */}
      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? "bg-brand-bg/95 backdrop-blur-md border-b border-brand-border py-2.5 sm:py-3 shadow-lg"
            : "bg-brand-bg/40 backdrop-blur-sm py-3.5 sm:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-brand-gold to-brand-purple flex items-center justify-center p-0.5 shadow-gold">
                <div className="w-full h-full bg-brand-bg rounded-[7px] flex items-center justify-center">
                  <span className="text-brand-gold font-black tracking-wider text-xs sm:text-sm group-hover:scale-105 transition-transform">
                    FF
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold tracking-widest text-base sm:text-xl text-brand-text font-display">
                  {BRAND_NAME}
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-widest text-brand-gold uppercase font-semibold">
                  ঈগল এন্ডুরেন্স
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-brand-text-muted hover:text-brand-gold transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
              {/* Desktop Dynamic Click to Call */}
              <a
                href={`tel:${cleanPhone}`}
                className="hidden lg:flex items-center gap-2 text-xs font-bold text-brand-gold hover:text-white bg-brand-card hover:bg-brand-cardHover px-3 py-1.5 rounded-xl border border-brand-borderGold/40 transition-colors shadow-sm"
                title="সরাসরি কল করুন"
              >
                <PhoneCall className="w-3.5 h-3.5 text-brand-gold" />
                <span>{phone}</span>
              </a>

              {/* Mobile Quick Call Button */}
              <a
                href={`tel:${cleanPhone}`}
                className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-brand-surface border border-brand-border text-brand-gold hover:border-brand-gold/40 transition-colors flex items-center justify-center"
                aria-label={`কল করুন: ${phone}`}
                title={`কল করুন: ${phone}`}
              >
                <PhoneCall className="w-4 h-4 text-brand-gold" />
              </a>

              {/* Theme Toggle (Light / Dark Mode) */}
              <ThemeToggle />

              {/* Cart Trigger */}
              <button
                onClick={openCart}
                className="relative p-2 sm:p-2.5 rounded-xl bg-brand-surface border border-brand-border hover:border-brand-gold/40 text-brand-text transition-all hover:shadow-gold"
                aria-label="শপিং ব্যাগ দেখুন"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gold-gradient text-black font-extrabold text-[11px] flex items-center justify-center shadow-md animate-bounce">
                    {totalQuantity}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 sm:p-2.5 rounded-xl bg-brand-surface border border-brand-border text-brand-text"
                aria-label="মেনু খুলুন/বন্ধ করুন"
              >
                {mobileMenuOpen ? (
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 p-5 rounded-2xl bg-brand-surface/98 border border-brand-border shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200">
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-medium text-brand-text hover:text-brand-gold py-1 border-b border-brand-border/50"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-2 flex flex-col gap-3">
                  <div className="flex items-center justify-between py-2 border-b border-brand-border/40">
                    <span className="text-sm text-brand-text-muted">থিম পরিবর্তন করুন:</span>
                    <ThemeToggle />
                  </div>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="flex items-center gap-2 text-sm text-brand-gold font-bold py-1"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>কল করুন: {phone}</span>
                  </a>
                  <Link
                    href="/checkout?qty=1"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-xl bg-gold-gradient text-black font-bold text-sm shadow-gold"
                  >
                    এখনই অর্ডার করুন (ক্যাশ অন ডেলিভারি)
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
