import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LOCAL_STORE_FILE = path.join(process.cwd(), ".local-db.json");

function getLocalSettings() {
  try {
    if (fs.existsSync(LOCAL_STORE_FILE)) {
      const store = JSON.parse(fs.readFileSync(LOCAL_STORE_FILE, "utf-8"));
      if (store.settings) return store.settings;
    }
  } catch {}
  return {};
}

export async function GET() {
  try {
    const settings = getLocalSettings();
    const apiKey = settings.steadfast_api_key?.trim();
    const secretKey = settings.steadfast_secret_key?.trim();

    if (!apiKey || !secretKey) {
      return NextResponse.json({
        success: false,
        configured: false,
        message: "Steadfast API Key এবং Secret Key সেভ করা নেই। অনুগ্রহ করে নিচে কিগুলো বসিয়ে সেভ করুন।",
      });
    }

    try {
      const res = await fetch("https://portal.steadfast.com.bd/api/v1/get_balance", {
        headers: {
          "Api-Key": apiKey,
          "Secret-Key": secretKey,
        },
      });

      const data = await res.json();

      if (data.status === 200) {
        return NextResponse.json({
          success: true,
          configured: true,
          balance: data.current_balance,
          message: `Steadfast এর সাথে সফলভাবে কানেক্টেড! বর্তমান ব্যালেন্স: ৳${data.current_balance}`,
        });
      } else {
        return NextResponse.json({
          success: false,
          configured: true,
          message: data.message || "Steadfast এপিআই কি সঠিক নয়। দয়া করে পোর্টাল থেকে আবার কপি করুন।",
        });
      }
    } catch (err: any) {
      return NextResponse.json({
        success: false,
        configured: true,
        message: `Steadfast সার্ভারে কানেক্ট করা যায়নি: ${err.message}`,
      });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
