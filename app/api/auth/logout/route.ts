import { NextResponse } from "next/server";
import { COOKIE_NAME, clearSessionCookie } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST() {
  await clearSessionCookie();
  const response = NextResponse.json({ success: true, message: "Logged out successfully." });
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export async function GET() {
  await clearSessionCookie();
  const redirectUrl = new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
