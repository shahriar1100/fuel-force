import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { settingsUpdateSchema } from "@/lib/validation";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import fs from "fs";
import path from "path";

const LOCAL_STORE_FILE = path.join(process.cwd(), ".local-db.json");

function getLocalSettings() {
  try {
    if (fs.existsSync(LOCAL_STORE_FILE)) {
      const store = JSON.parse(fs.readFileSync(LOCAL_STORE_FILE, "utf-8"));
      if (store.settings && Object.keys(store.settings).length > 0) {
        return store.settings;
      }
    }
  } catch {}
  return DEFAULT_SETTINGS;
}

function saveLocalSettings(settings: any) {
  try {
    let store: any = {};
    if (fs.existsSync(LOCAL_STORE_FILE)) {
      store = JSON.parse(fs.readFileSync(LOCAL_STORE_FILE, "utf-8"));
    }
    store.settings = settings;
    fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save local settings:", err);
  }
}

export async function GET() {
  try {
    // 1. Try Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const { data, error } = await supabase.from("site_settings").select("*").limit(1).single();
        if (data && !error) {
          return NextResponse.json({ success: true, settings: data });
        }
      } catch {}
    }

    // 2. Return local
    return NextResponse.json({ success: true, settings: getLocalSettings() });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const result = settingsUpdateSchema.safeParse(body);

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

    const {
      delivery_charge_inside_dhaka,
      delivery_charge_outside_dhaka,
      contact_phone,
      whatsapp_number,
      announcement_text,
      announcement_enabled,
      facebook_pixel_id,
    } = result.data;

    let updated: any = null;

    // 1. Try Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from("site_settings")
          .update({
            delivery_charge_inside_dhaka,
            delivery_charge_outside_dhaka,
            contact_phone,
            whatsapp_number,
            updated_at: new Date().toISOString(),
          })
          .neq("id", "00000000-0000-0000-0000-000000000000")
          .select()
          .single();

        if (data && !error) {
          updated = data;
        }
      } catch {}
    }

    // 2. Local store
    const existing = getLocalSettings();
    const newSettings = {
      ...existing,
      delivery_charge_inside_dhaka,
      delivery_charge_outside_dhaka,
      contact_phone,
      whatsapp_number,
      announcement_text: announcement_text !== undefined ? announcement_text : existing.announcement_text,
      announcement_enabled: announcement_enabled !== undefined ? announcement_enabled : existing.announcement_enabled,
      facebook_pixel_id: facebook_pixel_id !== undefined ? facebook_pixel_id : existing.facebook_pixel_id,
    };
    saveLocalSettings(newSettings);
    if (!updated) updated = newSettings;

    return NextResponse.json({
      success: true,
      message: "Website settings updated successfully",
      settings: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
