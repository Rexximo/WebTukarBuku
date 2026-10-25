import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET ?? "");
const cookieName = process.env.COOKIE_NAME ?? "tb_token";

const memberPrefixes = ["/katalog", "/permintaan", "/riwayat", "/profil"];

interface SessionPayload {
  role?: string;
  mcp?: boolean;
}

async function readSession(request: NextRequest): Promise<SessionPayload | null> {
  const token = request.cookies.get(cookieName)?.value;
  if (!token || secretKey.length === 0) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await readSession(request);

  const isAdminArea = pathname.startsWith("/admin");
  const isMemberArea = memberPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  const isProtected = isAdminArea || isMemberArea;

  if (!session && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/masuk";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (session && pathname === "/masuk") {
    const url = request.nextUrl.clone();
    url.pathname = session.role === "admin" ? "/admin" : "/katalog";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (session && isAdminArea && session.role !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = "/katalog";
    url.search = "?error=akses";
    return NextResponse.redirect(url);
  }

  if (
    session &&
    session.mcp === true &&
    isProtected &&
    pathname !== "/profil/kata-sandi"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/profil/kata-sandi";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|api|uploads|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)",
  ],
};

