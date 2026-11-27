import { NextResponse } from "next/server";
import { getStoreData } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await getStoreData();
    return NextResponse.json({
      success: true,
      product: data.product,
      images: data.images,
      bannerImage: data.bannerImage,
      settings: data.settings,
    });
  } catch (err: any) {
    console.error("Failed to get product data:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to load product data" },
      { status: 500 }
    );
  }
}
