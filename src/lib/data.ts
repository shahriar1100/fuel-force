import fs from "fs";
import path from "path";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import {
  BRAND_NAME,
  PRODUCT_NAME,
  PRODUCT_PRICE,
  PRODUCT_REGULAR_PRICE,
  DEFAULT_STOCK,
  DEFAULT_SETTINGS,
  INITIAL_PRODUCT_IMAGES,
} from "@/lib/constants";

const LOCAL_STORE_FILE = path.join(process.cwd(), ".local-db.json");

export interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  regular_price: number;
  stock_quantity: number;
  is_active: boolean;
}

export interface ProductImageData {
  id: string;
  url: string;
  alt: string;
  is_primary: boolean;
  display_order: number;
}

export interface StoreSettingsData {
  delivery_charge_inside_dhaka: number;
  delivery_charge_outside_dhaka: number;
  contact_phone: string;
  whatsapp_number: string;
  announcement_text?: string;
  announcement_enabled?: boolean;
  facebook_pixel_id?: string;
}

export interface StoreData {
  product: ProductData;
  images: ProductImageData[];
  bannerImage: ProductImageData;
  settings: StoreSettingsData;
}

function getLocalStore() {
  try {
    if (fs.existsSync(LOCAL_STORE_FILE)) {
      return JSON.parse(fs.readFileSync(LOCAL_STORE_FILE, "utf-8"));
    }
  } catch {}
  return {
    orders: [],
    customers: [],
    products: [],
    images: [],
    settings: {},
  };
}

export async function getStoreData(): Promise<StoreData> {
  const localStore = getLocalStore();

  // Default values
  let product: ProductData = {
    id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    name: `${BRAND_NAME} – ${PRODUCT_NAME}`,
    slug: "eagle-endurance-for-men",
    description:
      "Premium nutritional dietary supplement formulated for men. Featuring standardized G115® Ginseng extract and KSM-66® Ashwagandha root extract. 60 doses per container.",
    price: PRODUCT_PRICE,
    regular_price: PRODUCT_REGULAR_PRICE,
    stock_quantity: DEFAULT_STOCK,
    is_active: true,
  };

  let images: ProductImageData[] = INITIAL_PRODUCT_IMAGES.map((img) => ({
    id: img.id,
    url: img.url,
    alt: img.alt || `${BRAND_NAME} – ${PRODUCT_NAME}`,
    is_primary: img.is_primary,
    display_order: img.display_order,
  }));

  let settings: StoreSettingsData = {
    ...DEFAULT_SETTINGS,
  };

  // 1. Try Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();

      // Fetch Product
      const { data: prodData } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .limit(1)
        .single();

      if (prodData) {
        product = {
          id: prodData.id,
          name: prodData.name || product.name,
          slug: prodData.slug || product.slug,
          description: prodData.description || product.description,
          price: Number(prodData.price) || product.price,
          regular_price: Math.max(Number(prodData.price) + 800, PRODUCT_REGULAR_PRICE),
          stock_quantity: prodData.stock_quantity ?? product.stock_quantity,
          is_active: prodData.is_active ?? true,
        };
      }

      // Fetch Images
      const { data: imgData } = await supabase
        .from("product_images")
        .select("*")
        .order("display_order", { ascending: true });

      if (imgData && imgData.length > 0) {
        images = imgData.map((img: any, idx: number) => ({
          id: img.id,
          url: img.image_url,
          alt: `${BRAND_NAME} ছবি ${idx + 1}`,
          is_primary: Boolean(img.is_primary),
          display_order: img.display_order || idx,
        }));
      }

      // Fetch Settings
      const { data: setData } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .single();

      if (setData) {
        settings = {
          delivery_charge_inside_dhaka: Number(setData.delivery_charge_inside_dhaka) || settings.delivery_charge_inside_dhaka,
          delivery_charge_outside_dhaka: Number(setData.delivery_charge_outside_dhaka) || settings.delivery_charge_outside_dhaka,
          contact_phone: setData.contact_phone || settings.contact_phone,
          whatsapp_number: setData.whatsapp_number || settings.whatsapp_number,
        };
      }
    } catch (err) {
      console.warn("Supabase fetch fallback to local store in getStoreData:", err);
    }
  }

  // 2. Read from Local Store overrides
  if (localStore.products && localStore.products[0]) {
    const lp = localStore.products[0];
    product = {
      ...product,
      id: lp.id || product.id,
      name: lp.name || product.name,
      description: lp.description || product.description,
      price: Number(lp.price) || product.price,
      regular_price: Number(lp.regular_price) || Math.max(Number(lp.price) + 600, PRODUCT_REGULAR_PRICE),
      stock_quantity: lp.stock_quantity ?? product.stock_quantity,
    };
  }

  if (localStore.images && Array.isArray(localStore.images) && localStore.images.length > 0) {
    images = localStore.images.map((img: any, idx: number) => ({
      id: img.id,
      url: img.image_url || img.url,
      alt: img.alt || `${BRAND_NAME} ছবি ${idx + 1}`,
      is_primary: Boolean(img.is_primary),
      display_order: img.display_order || idx,
    }));
  }

  if (localStore.settings && typeof localStore.settings === "object") {
    settings = {
      ...settings,
      ...localStore.settings,
    };
  }

  // 3. Determine Banner Image (the primary image, or the first image)
  const primaryImage = images.find((img) => img.is_primary);
  const bannerImage = primaryImage || images[0] || {
    id: "default-banner",
    url: INITIAL_PRODUCT_IMAGES[0].url,
    alt: `${BRAND_NAME} মূল ছবি`,
    is_primary: true,
    display_order: 0,
  };

  return {
    product,
    images,
    bannerImage,
    settings,
  };
}
