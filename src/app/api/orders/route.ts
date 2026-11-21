import { NextRequest, NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validation";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { PRODUCT_PRICE, DEFAULT_SETTINGS } from "@/lib/constants";
import fs from "fs";
import path from "path";

// In-memory rate-limiter / deduplication map: phone -> timestamp
const recentSubmissions = new Map<string, number>();

// Local storage fallback file path
const LOCAL_STORE_FILE = path.join(process.cwd(), ".local-db.json");

function getLocalStore() {
  try {
    if (fs.existsSync(LOCAL_STORE_FILE)) {
      const data = fs.readFileSync(LOCAL_STORE_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch {
    // Ignore error
  }
  return {
    orders: [],
    customers: [],
    products: [
      {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        name: "FORCE FUEL – EAGLE ENDURANCE FOR MEN",
        slug: "eagle-endurance-for-men",
        description:
          "Premium nutritional dietary supplement formulated for men. Featuring standardized G115® Ginseng extract and KSM-66® Ashwagandha root extract. 60 doses per container.",
        price: PRODUCT_PRICE,
        stock_quantity: 100,
        is_active: true,
      },
    ],
    settings: DEFAULT_SETTINGS,
  };
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Server-side validation via Zod
    const validationResult = checkoutSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validationResult.error.flatten().fieldErrors,
          message: "Validation failed. Please correct the highlighted fields.",
        },
        { status: 400 }
      );
    }

    const { name, phone, district, fullAddress, quantity } = validationResult.data;

    // 2. Prevent duplicate order submissions (within 30 seconds for same phone and address)
    const now = Date.now();
    const phoneKey = `${phone.trim()}_${fullAddress.trim()}`;
    const lastSubTime = recentSubmissions.get(phoneKey);
    if (lastSubTime && now - lastSubTime < 30000) {
      return NextResponse.json(
        {
          success: false,
          message: "An order with this phone number was recently submitted. Please wait a minute before re-ordering.",
        },
        { status: 429 }
      );
    }
    recentSubmissions.set(phoneKey, now);

    // 3. Secure Server-side price calculation (never trust client)
    const supabase = createAdminClient();
    let unitPrice = PRODUCT_PRICE;
    let deliveryInsideDhaka = DEFAULT_SETTINGS.delivery_charge_inside_dhaka;
    let deliveryOutsideDhaka = DEFAULT_SETTINGS.delivery_charge_outside_dhaka;
    let productId = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

    // Query active product & settings from Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const { data: productData } = await supabase
          .from("products")
          .select("id, price, stock_quantity")
          .eq("is_active", true)
          .limit(1)
          .single();

        if (productData) {
          unitPrice = Number(productData.price);
          productId = productData.id;
        }

        const { data: settingsData } = await supabase
          .from("site_settings")
          .select("delivery_charge_inside_dhaka, delivery_charge_outside_dhaka")
          .limit(1)
          .single();

        if (settingsData) {
          deliveryInsideDhaka = Number(settingsData.delivery_charge_inside_dhaka);
          deliveryOutsideDhaka = Number(settingsData.delivery_charge_outside_dhaka);
        }
      } catch {
        // Use defaults if Supabase connection fails
      }
    }

    const isDhaka = district.trim().toLowerCase() === "dhaka";
    const deliveryCharge = isDhaka ? deliveryInsideDhaka : deliveryOutsideDhaka;
    const subtotal = unitPrice * quantity;
    const totalAmount = subtotal + deliveryCharge;
    const orderNumber = generateOrderNumber();

    let createdOrder: any = null;

    // 4. Try saving to Supabase first if configured
    if (isSupabaseConfigured()) {
      try {
        // Insert customer
        const { data: customerData, error: custErr } = await supabase
          .from("customers")
          .insert({
            name: name.trim(),
            phone: phone.trim(),
            district: district.trim(),
            full_address: fullAddress.trim(),
          })
          .select()
          .single();

        if (customerData && !custErr) {
          // Insert order
          const { data: orderData, error: orderErr } = await supabase
            .from("orders")
            .insert({
              order_number: orderNumber,
              customer_id: customerData.id,
              subtotal,
              delivery_charge: deliveryCharge,
              total_amount: totalAmount,
              payment_method: "COD",
              payment_status: "Pending",
              order_status: "Pending",
            })
            .select()
            .single();

          if (orderData && !orderErr) {
            // Insert order items
            await supabase.from("order_items").insert({
              order_id: orderData.id,
              product_id: productId,
              quantity,
              unit_price: unitPrice,
              total_price: subtotal,
            });

            createdOrder = {
              ...orderData,
              customer: customerData,
            };
          }
        }
      } catch (err) {
        console.warn("Supabase insert error, falling back to local database store:", err);
      }
    }

    // 5. If Supabase is not yet populated or errored, write to local fallback database
    if (!createdOrder) {
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

      const order = {
        id: orderId,
        order_number: orderNumber,
        customer_id: customerId,
        subtotal,
        delivery_charge: deliveryCharge,
        total_amount: totalAmount,
        payment_method: "COD",
        payment_status: "Pending",
        order_status: "Pending",
        created_at: new Date().toISOString(),
        customer,
        order_items: [
          {
            id: "item_" + Math.random().toString(36).substring(2, 9),
            order_id: orderId,
            product_id: productId,
            quantity,
            unit_price: unitPrice,
            total_price: subtotal,
            product: {
              name: "FORCE FUEL – EAGLE ENDURANCE FOR MEN",
              price: unitPrice,
            },
          },
        ],
      };

      localStore.customers.push(customer);
      localStore.orders.unshift(order);
      saveLocalStore(localStore);

      createdOrder = order;
    }

    return NextResponse.json({
      success: true,
      message: "Order placed successfully!",
      orderNumber,
      order: {
        orderNumber,
        subtotal,
        deliveryCharge,
        totalAmount,
        paymentMethod: "COD",
        customerName: name,
        phone,
        district,
        address: fullAddress,
        quantity,
      },
    });
  } catch (error: any) {
    console.error("Order processing error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred while placing your order. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Allow checking an order by order_number for order-confirmation page
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get("orderNumber");

  if (!orderNumber) {
    return NextResponse.json({ success: false, message: "Order number required" }, { status: 400 });
  }

  // 1. Try Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const { data: orderData } = await supabase
        .from("orders")
        .select("*, customer:customers(*), order_items(*, product:products(*))")
        .eq("order_number", orderNumber)
        .single();

      if (orderData) {
        return NextResponse.json({ success: true, order: orderData });
      }
    } catch {
      // Check local store
    }
  }

  // 2. Check local store
  const localStore = getLocalStore();
  const order = localStore.orders.find((o: any) => o.order_number === orderNumber);
  if (order) {
    return NextResponse.json({ success: true, order });
  }

  return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
}
