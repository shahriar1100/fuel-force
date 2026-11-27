"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, AlertCircle, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { BRAND_NAME } from "@/lib/constants";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin");
        return;
      }

      setError(data.message || "ভুল ইমেইল বা পাসওয়ার্ড দেওয়া হয়েছে");
    } catch (err: any) {
      setError(err.message || "লগইন করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-brand-gold to-brand-purple p-0.5 mx-auto mb-3 sm:mb-4 shadow-gold">
            <div className="w-full h-full bg-brand-bg rounded-[14px] flex items-center justify-center">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-brand-gold" />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-text font-display">
            {BRAND_NAME} অ্যাডমিন পোর্টাল
          </h1>
          <p className="text-xs text-brand-text-muted mt-1">
            শুধুমাত্র অনুমোদিত স্টোর ম্যানেজার ও অপারেটরদের প্রবেশের জন্য।
          </p>
        </div>

        <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-brand-surface border border-brand-border shadow-luxury">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brand-text-muted mb-2 uppercase tracking-wider">
                অ্যাডমিন ইমেইল
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@forcefuel.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-brand-card border border-brand-border text-brand-text placeholder-brand-text-dim text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
                <Mail className="w-4 h-4 text-brand-text-dim absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text-muted mb-2 uppercase tracking-wider">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-brand-card border border-brand-border text-brand-text placeholder-brand-text-dim text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
                <Lock className="w-4 h-4 text-brand-text-dim absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-black font-extrabold text-sm shadow-gold transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>ড্যাশবোর্ডে প্রবেশ করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-brand-border text-center">
            <Link
              href="/"
              className="text-xs text-brand-text-muted hover:text-brand-gold transition-colors"
            >
              ← কাস্টমার স্টোরে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
