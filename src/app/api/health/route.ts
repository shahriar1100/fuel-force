import { NextResponse } from "next/server";
import { isSupabaseConfigured, createAdminClient } from "@/lib/supabase/admin";
import { getStoreData } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "healthy";
  let dbType = "local";

  try {
    if (isSupabaseConfigured()) {
      dbType = "supabase";
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("products")
        .select("id")
        .limit(1);

      if (error) {
        dbStatus = `supabase_error: ${error.message}`;
      }
    } else {
      await getStoreData();
      dbType = "local_json";
    }
  } catch (err: any) {
    dbStatus = `error: ${err.message}`;
  }

  const responseTime = `${Date.now() - startTime}ms`;

  return NextResponse.json({
    status: "ok",
    app: "Force Fuel Store",
    timestamp: new Date().toISOString(),
    database: {
      type: dbType,
      status: dbStatus,
      responseTime,
    },
  });
}
