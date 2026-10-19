import { NextResponse, type NextRequest } from "next/server";

const cookieName = process.env.COOKIE_NAME ?? "tb_token";

export function GET(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/masuk";
  url.search = "";

  const response = NextResponse.redirect(url);
  response.cookies.set({
    name: cookieName,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
