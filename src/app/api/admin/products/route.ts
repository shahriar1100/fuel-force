import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { productUpdateSchema } from "@/lib/validation";
import { PRODUCT_PRICE, DEFAULT_STOCK } from "@/lib/constants";
import fs from "fs";
import path from "path";

const LOCAL_STORE_FILE = path.join(process.cwd(), ".local-db.json");

function getLocalStore() {
  try {
    if (fs.existsSync(LOCAL_STORE_FILE)) {
      return JSON.parse(fs.readFileSync(LOCAL_STORE_FILE, "utf-8"));
    }
  } catch {}
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
        stock_quantity: DEFAULT_STOCK,
        is_active: true,
      },
    ],
    settings: {},
  };
}

function saveLocalStore(store: any) {
  try {
    fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save local store:", err);
  }
}

export async function GET() {
  try {
    // 1. Try Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from("products")
          .select("*, product_images(*)")
          .limit(1)
          .single();

        if (data && !error) {
          return NextResponse.json({ success: true, product: data });
        }
      } catch {}
    }

    // 2. Fallback to local store
    const localStore = getLocalStore();
    const product = localStore.products?.[0] || {
      id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      name: "FORCE FUEL – EAGLE ENDURANCE FOR MEN",
      slug: "eagle-endurance-for-men",
      description:
        "Premium nutritional dietary supplement formulated for men. Featuring standardized G115® Ginseng extract and KSM-66® Ashwagandha root extract. 60 doses per container.",
      price: PRODUCT_PRICE,
      stock_quantity: DEFAULT_STOCK,
      is_active: true,
    };

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const result = productUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          errors: result.error.flatten().fieldErrors,
          message: "Validation failed",
        },
        { status: 400 }
      );
    }

    const { name, description, price, stock_quantity } = result.data;
    let updatedProduct: any = null;

    // 1. Try Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from("products")
          .update({
            name,
            description,
            price,
            stock_quantity,
            updated_at: new Date().toISOString(),
          })
          .eq("slug", "eagle-endurance-for-men")
          .select()
          .single();

        if (data && !error) {
          updatedProduct = data;
        }
      } catch {}
    }

    // 2. Also update local store
    const localStore = getLocalStore();
    if (localStore.products && localStore.products.length > 0) {
      localStore.products[0] = {
        ...localStore.products[0],
        name,
        description,
        price,
        stock_quantity,
        updated_at: new Date().toISOString(),
      };
      saveLocalStore(localStore);
      if (!updatedProduct) updatedProduct = localStore.products[0];
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
