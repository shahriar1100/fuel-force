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

export async function GET(req: NextRequest) {
  try {
    let orders: any[] = [];

    // Try Supabase first if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from("orders")
          .select("*, customer:customers(*), order_items(*, product:products(*))")
          .order("created_at", { ascending: false });

        if (data && !error && data.length > 0) {
          orders = data;
        }
      } catch {
        // Fallback to local store
      }
    }

    // If Supabase has no records or errored, fetch from local store
    if (orders.length === 0) {
      const localStore = getLocalStore();
      orders = localStore.orders || [];
    }

    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, orderStatus } = body;

    const validStatuses = [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Returned",
    ];

    if (!orderId || !validStatuses.includes(orderStatus)) {
      return NextResponse.json(
        { success: false, message: "Invalid order ID or order status" },
        { status: 400 }
      );
    }

    let updated = false;

    // 1. Try Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from("orders")
          .update({ order_status: orderStatus })
          .eq("id", orderId)
          .select()
          .single();

        if (data && !error) {
          updated = true;
        }
      } catch {}
    }

    // 2. Also update local store
    const localStore = getLocalStore();
    const idx = (localStore.orders || []).findIndex(
      (o: any) => o.id === orderId || o.order_number === orderId
    );
    if (idx !== -1) {
      localStore.orders[idx].order_status = orderStatus;
      saveLocalStore(localStore);
      updated = true;
    }

    if (!updated) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${orderStatus}`,
      orderStatus,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
