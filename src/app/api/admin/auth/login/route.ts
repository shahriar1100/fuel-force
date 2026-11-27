import { NextRequest, NextResponse } from "next/server";
import { checkAdminCredentials, createAdminToken } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

// In-memory brute force protection: IP -> { attempts, resetAt }
const loginAttempts = new Map<string, { attempts: number; resetAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";
    const now = Date.now();
    const tracker = loginAttempts.get(ip);

    if (tracker && tracker.resetAt > now && tracker.attempts >= 5) {
      const waitSeconds = Math.ceil((tracker.resetAt - now) / 1000);
      return NextResponse.json(
        {
          success: false,
          message: `অতিরিক্ত ভুল চেষ্টার কারণে লগইন সাময়িকভাবে ব্লক করা হয়েছে। অনুগ্রহ করে ${waitSeconds} সেকেন্ড পর চেষ্টা করুন।`,
        },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "ইমেইল এবং পাসওয়ার্ড আবশ্যক" },
        { status: 400 }
      );
    }

    let isAuthenticated = false;

    // 1. Check environment / fallback admin credentials
    if (checkAdminCredentials(email, password)) {
      isAuthenticated = true;
    }

    // 2. Try Supabase Auth if configured and not yet authenticated
    if (!isAuthenticated) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (supabaseUrl && supabaseKey && !supabaseUrl.includes("placeholder")) {
        try {
          const supabase = createClient(supabaseUrl, supabaseKey);
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });
          if (data?.session && !error) {
            isAuthenticated = true;
          }
        } catch {
          // Ignore error and proceed
        }
      }
    }

    if (!isAuthenticated) {
      // Record failed attempt
      const attempts = (tracker && tracker.resetAt > now ? tracker.attempts : 0) + 1;
      loginAttempts.set(ip, { attempts, resetAt: now + 5 * 60 * 1000 }); // 5 min window

      return NextResponse.json(
        { success: false, message: "ভুল ইমেইল বা পাসওয়ার্ড দেওয়া হয়েছে" },
        { status: 401 }
      );
    }

    // Reset attempt tracker on success
    loginAttempts.delete(ip);

    // Create cryptographically signed token
    const token = await createAdminToken(email.trim());

    const response = NextResponse.json({
      success: true,
      message: "অ্যাডমিন লগইন সফল হয়েছে",
    });

    // Set secure, httpOnly cookie (JavaScript cannot read or tamper)
    const isProduction = process.env.NODE_ENV === "production";
    response.cookies.set("ff_admin_token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    // Set legacy indicator for backward compatibility in UI state
    response.cookies.set("ff_admin_auth", "true", {
      httpOnly: false,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "লগইন করতে সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}
