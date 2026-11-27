import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import fs from "fs";
import path from "path";

const LOCAL_STORE_FILE = path.join(process.cwd(), ".local-db.json");

function getLocalStore() {
  try {
    if (fs.existsSync(LOCAL_STORE_FILE)) {
      return JSON.parse(fs.readFileSync(LOCAL_STORE_FILE, "utf-8"));
    }
  } catch {}
  return { orders: [], customers: [], products: [], settings: {} };
}

function saveLocalStore(store: any) {
  try {
    fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save local store:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, customNote } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, message: "অর্ডার আইডি প্রয়োজন" }, { status: 400 });
    }

    const localStore = getLocalStore();
    const orderIndex = (localStore.orders || []).findIndex(
      (o: any) => o.id === orderId || o.order_number === orderId
    );

    if (orderIndex === -1) {
      return NextResponse.json({ success: false, message: "অর্ডার খুঁজে পাওয়া যায়নি" }, { status: 404 });
    }

    const order = localStore.orders[orderIndex];
    const settings = localStore.settings || {};

    const recipientName = order.customer?.name || "Customer";
    const recipientPhone = order.customer?.phone || "";
    const recipientAddress = `${order.customer?.full_address || ""}, ${order.customer?.district || ""}`.trim();
    const codAmount = Number(order.total_amount) || 0;
    const note = customNote || `FORCE FUEL - ${order.order_items?.[0]?.quantity || 1} Bottle (COD)`;

    let trackingCode = "";
    let consignmentId = "";
    let isLiveBooking = false;

    // Check if Steadfast API Key and Secret Key are configured
    const apiKey = settings.steadfast_api_key?.trim();
    const secretKey = settings.steadfast_secret_key?.trim();

    if (apiKey && secretKey) {
      // 1. Live Steadfast API Call
      try {
        const sfRes = await fetch("https://portal.steadfast.com.bd/api/v1/create_order", {
          method: "POST",
          headers: {
            "Api-Key": apiKey,
            "Secret-Key": secretKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            invoice: order.order_number,
            recipient_name: recipientName,
            recipient_phone: recipientPhone,
            recipient_address: recipientAddress,
            cod_amount: codAmount,
            note: note,
          }),
        });

        const sfData = await sfRes.json();

        if (sfData.status === 200 && sfData.consignment) {
          trackingCode = sfData.consignment.tracking_code || String(sfData.consignment.consignment_id);
          consignmentId = String(sfData.consignment.consignment_id);
          isLiveBooking = true;
        } else {
          return NextResponse.json({
            success: false,
            message: sfData.message || (sfData.errors ? JSON.stringify(sfData.errors) : "Steadfast API থেকে বুকিং ব্যর্থ হয়েছে"),
          }, { status: 400 });
        }
      } catch (apiErr: any) {
        return NextResponse.json({
          success: false,
          message: `Steadfast সার্ভারে সংযোগ করতে সমস্যা: ${apiErr.message}`,
        }, { status: 502 });
      }
    } else {
      // 2. Demo Sandbox Consignment Generation
      // Allows immediate testing even before the merchant pastes their live Steadfast API Key
      const randomCode = Math.floor(100000 + Math.random() * 900000);
      trackingCode = `SF${randomCode}`;
      consignmentId = String(randomCode);
    }

    const trackingUrl = `https://steadfast.com.bd/t/${trackingCode}`;
    const newNote = order.admin_notes
      ? `${order.admin_notes} | Steadfast বুকিং (${trackingCode})`
      : `Steadfast পার্সেল বুকিং (${trackingCode})`;

    // Update in local store
    localStore.orders[orderIndex] = {
      ...order,
      courier_name: "Steadfast",
      courier_tracking_id: trackingCode,
      order_status: "Shipped",
      admin_notes: newNote,
    };
    saveLocalStore(localStore);

    // Update in Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        await supabase
          .from("orders")
          .update({
            order_status: "Shipped",
            updated_at: new Date().toISOString(),
          })
          .eq("id", order.id);
      } catch {}
    }

    return NextResponse.json({
      success: true,
      isLiveBooking,
      trackingCode,
      consignmentId,
      trackingUrl,
      orderStatus: "Shipped",
      message: isLiveBooking
        ? `Steadfast কুরিয়ারে সফলভাবে বুকিং সম্পন্ন! ট্র্যাকিং কোড: ${trackingCode}`
        : `ডেমো বুকিং সম্পন্ন! ট্র্যাকিং কোড: ${trackingCode} (আসল পার্সেল পাঠাতে সেটিংসে Steadfast API Key যুক্ত করুন)`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
