import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8276";

async function verifyToken(token: string): Promise<{ valid: boolean; role?: string }> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/users/profile`, {
      method: "GET",
      headers: {
        Cookie: `access_token=${token}`,
      },
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      return { valid: true, role: data.role };
    }
    return { valid: false };
  } catch {
    return { valid: false };
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;

  if (pathname.startsWith("/admin")) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const verification = await verifyToken(accessToken);
    if (!verification.valid || verification.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/cabinet")) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const verification = await verifyToken(accessToken);
    if (!verification.valid) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
