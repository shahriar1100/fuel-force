import { NextResponse } from "next/server";
import { getStoreData } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await getStoreData();

    // Sanitize settings: NEVER expose courier API keys or secret credentials to the public!
    const publicSettings = {
      delivery_charge_inside_dhaka: data.settings.delivery_charge_inside_dhaka,
      delivery_charge_outside_dhaka: data.settings.delivery_charge_outside_dhaka,
      contact_phone: data.settings.contact_phone,
      whatsapp_number: data.settings.whatsapp_number,
      announcement_text: data.settings.announcement_text,
      announcement_enabled: data.settings.announcement_enabled,
      facebook_pixel_id: data.settings.facebook_pixel_id,
    };

    return NextResponse.json({
      success: true,
      product: data.product,
      images: data.images,
      bannerImage: data.bannerImage,
      settings: publicSettings,
    });
  } catch (err: any) {
    console.error("Failed to get product data:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to load product data" },
      { status: 500 }
    );
  }
}
