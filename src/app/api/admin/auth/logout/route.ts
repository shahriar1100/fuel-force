import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "লগআউট সফল হয়েছে",
  });

  response.cookies.set("ff_admin_token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  response.cookies.set("ff_admin_auth", "", {
    httpOnly: false,
    path: "/",
    maxAge: 0,
  });

  return response;
}
