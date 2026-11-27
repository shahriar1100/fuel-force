import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { getStoreData } from "@/lib/data";
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

function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomHex = Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();
  return `FF-${dateStr}-${randomHex}`;
}

export async function GET() {
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
    const { orderId, orderStatus, admin_notes, courier_tracking_id, courier_name } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }

    const validStatuses = [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Returned",
    ];

    if (orderStatus && !validStatuses.includes(orderStatus)) {
      return NextResponse.json(
        { success: false, message: "Invalid order status" },
        { status: 400 }
      );
    }

    let updated = false;
    const updatePayload: any = {};
    if (orderStatus) updatePayload.order_status = orderStatus;
    if (admin_notes !== undefined) updatePayload.admin_notes = admin_notes;
    if (courier_tracking_id !== undefined) updatePayload.courier_tracking_id = courier_tracking_id;
    if (courier_name !== undefined) updatePayload.courier_name = courier_name;

    // 1. Try Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from("orders")
          .update(updatePayload)
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
      localStore.orders[idx] = {
        ...localStore.orders[idx],
        ...updatePayload,
      };
      saveLocalStore(localStore);
      updated = true;
    }

    if (!updated) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order: localStore.orders?.[idx] || updatePayload,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// Admin manual order creation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, district = "Dhaka", fullAddress, quantity = 1, admin_notes = "", order_status = "Confirmed" } = body;

    if (!name || !phone || !fullAddress) {
      return NextResponse.json(
        { success: false, message: "Customer Name, Phone and Address are required" },
        { status: 400 }
      );
    }

    const storeData = await getStoreData();
    const unitPrice = storeData.product.price;
    const isDhaka = district.trim().toLowerCase() === "dhaka";
    const deliveryCharge = isDhaka
      ? storeData.settings.delivery_charge_inside_dhaka
      : storeData.settings.delivery_charge_outside_dhaka;

    const parsedQty = Math.max(1, parseInt(quantity, 10) || 1);
    const subtotal = unitPrice * parsedQty;
    const totalAmount = subtotal + deliveryCharge;
    const orderNumber = generateOrderNumber();

    const localStore = getLocalStore();
    const customerId = "cust_" + Math.random().toString(36).substring(2, 9);
    const orderId = "ord_" + Math.random().toString(36).substring(2, 9);

    const customer = {
      id: customerId,
      name: name.trim(),
      phone: phone.trim(),
      district: district.trim(),
      full_address: fullAddress.trim(),
      created_at: new Date().toISOString(),
    };

    const newOrder = {
      id: orderId,
      order_number: orderNumber,
      customer_id: customerId,
      subtotal,
      delivery_charge: deliveryCharge,
      total_amount: totalAmount,
      payment_method: "COD",
      payment_status: "Pending",
      order_status,
      admin_notes,
      courier_tracking_id: "",
      courier_name: "",
      created_at: new Date().toISOString(),
      customer,
      order_items: [
        {
          id: "item_" + Math.random().toString(36).substring(2, 9),
          order_id: orderId,
          product_id: storeData.product.id,
          quantity: parsedQty,
          unit_price: unitPrice,
          total_price: subtotal,
          product: {
            name: storeData.product.name,
            price: unitPrice,
          },
        },
      ],
    };

    localStore.orders.unshift(newOrder);
    localStore.customers.unshift(customer);
    saveLocalStore(localStore);

    return NextResponse.json({
      success: true,
      message: "Manual order created successfully",
      order: newOrder,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// Admin delete order (for removing test/spam orders)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id");

    if (!orderId) {
      return NextResponse.json({ success: false, message: "Order ID required" }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        await supabase.from("orders").delete().eq("id", orderId);
      } catch {}
    }

    const localStore = getLocalStore();
    const initialLen = localStore.orders.length;
    localStore.orders = (localStore.orders || []).filter(
      (o: any) => o.id !== orderId && o.order_number !== orderId
    );
    saveLocalStore(localStore);

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
      deleted: localStore.orders.length < initialLen,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
