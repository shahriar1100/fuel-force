import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { INITIAL_PRODUCT_IMAGES } from "@/lib/constants";
import fs from "fs";
import path from "path";

const LOCAL_STORE_FILE = path.join(process.cwd(), ".local-db.json");

function getLocalImages() {
  try {
    if (fs.existsSync(LOCAL_STORE_FILE)) {
      const store = JSON.parse(fs.readFileSync(LOCAL_STORE_FILE, "utf-8"));
      if (store.images && store.images.length > 0) {
        return store.images;
      }
    }
  } catch {}
  return INITIAL_PRODUCT_IMAGES.map((img) => ({
    id: img.id,
    image_url: img.url,
    is_primary: img.is_primary,
    display_order: img.display_order,
  }));
}

function saveLocalImages(images: any[]) {
  try {
    let store: any = {};
    if (fs.existsSync(LOCAL_STORE_FILE)) {
      store = JSON.parse(fs.readFileSync(LOCAL_STORE_FILE, "utf-8"));
    }
    store.images = images;
    fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save local images:", err);
  }
}

export async function GET() {
  try {
    // 1. Try Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from("product_images")
          .select("*")
          .order("display_order", { ascending: true });

        if (data && !error && data.length > 0) {
          return NextResponse.json({ success: true, images: data });
        }
      } catch {}
    }

    // 2. Return local images
    return NextResponse.json({ success: true, images: getLocalImages() });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    // Validate mime type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, message: "Only image files are allowed" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `product-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

    let imageUrl = "";

    // 1. Try uploading to Supabase Storage bucket 'product-images' if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from("product-images")
          .upload(fileName, buffer, {
            contentType: file.type,
            upsert: true,
          });

        if (uploadData && !uploadErr) {
          const { data: publicUrlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(fileName);

          imageUrl = publicUrlData.publicUrl;

          // Save image record in database
          const { data: imgRow } = await supabase
            .from("product_images")
            .insert({
              product_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
              image_url: imageUrl,
              is_primary: false,
              display_order: 99,
            })
            .select()
            .single();

          if (imgRow) {
            return NextResponse.json({ success: true, image: imgRow });
          }
        }
      } catch (err) {
        console.warn("Supabase storage upload fallback:", err);
      }
    }

    // 2. Local filesystem upload fallback if Supabase Storage is not connected
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const localFilePath = path.join(uploadDir, fileName);
    fs.writeFileSync(localFilePath, buffer);
    imageUrl = `/uploads/${fileName}`;

    const newImage = {
      id: "img_" + Date.now(),
      image_url: imageUrl,
      is_primary: false,
      display_order: 99,
    };

    const currentImages = getLocalImages();
    currentImages.push(newImage);
    saveLocalImages(currentImages);

    return NextResponse.json({ success: true, image: newImage });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageId, action } = body;

    if (!imageId) {
      return NextResponse.json({ success: false, message: "Image ID required" }, { status: 400 });
    }

    if (action === "set_primary") {
      // 1. Try Supabase if configured
      if (isSupabaseConfigured()) {
        try {
          const supabase = createAdminClient();
          await supabase.from("product_images").update({ is_primary: false }).neq("id", "none");
          await supabase.from("product_images").update({ is_primary: true }).eq("id", imageId);
        } catch {}
      }

      // 2. Local store
      const localImages = getLocalImages();
      const updated = localImages.map((img: any) => ({
        ...img,
        is_primary: img.id === imageId,
      }));
      saveLocalImages(updated);

      return NextResponse.json({ success: true, message: "Primary image updated" });
    }

    return NextResponse.json({ success: false, message: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const imageId = searchParams.get("id");

    if (!imageId) {
      return NextResponse.json({ success: false, message: "Image ID required" }, { status: 400 });
    }

    // 1. Try Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        await supabase.from("product_images").delete().eq("id", imageId);
      } catch {}
    }

    // 2. Local store
    const localImages = getLocalImages();
    const filtered = localImages.filter((img: any) => img.id !== imageId);
    saveLocalImages(filtered);

    return NextResponse.json({ success: true, message: "Image deleted" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
