import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { accessToken, refreshToken } = await req.json();

  const res = NextResponse.json({ ok: true });

  // HttpOnly 쿠키에 저장
  res.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1일
  });

  res.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30일
  });

  return res;
}
