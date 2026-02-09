import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8276";

const getApiBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const isProductionBackend = backendUrl.includes("osobytie.ru") || backendUrl.includes("https://");
    if (isProductionBackend) {
      return `${backendUrl}/api`;
    }
    return `${backendUrl}/api/v1`;
  }
  return "http://localhost:8276/api/v1";
};

const API_BASE_URL = getApiBaseUrl();

async function verifyToken(token: string, isFromCookie: boolean): Promise<{ valid: boolean; role?: string }> {
  try {
    const headers: Record<string, string> = {};
    
    if (isFromCookie) {
      headers.Cookie = `access_token=${token}`;
    } else {
      headers.Authorization = `Bearer ${token}`;
    }
    
    console.log("[Middleware] Verifying token:", {
      isFromCookie,
      hasToken: !!token,
      apiUrl: `${API_BASE_URL}/users/profile`,
      headers: Object.keys(headers),
    });
    
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      console.log("[Middleware] Profile response:", {
        valid: true,
        role: data.role,
        userId: data.id || data._id,
        email: data.email,
      });
      return { valid: true, role: data.role };
    }
    
    console.log("[Middleware] Profile response failed:", {
      status: response.status,
      statusText: response.statusText,
    });
    return { valid: false };
  } catch (error) {
    console.error("[Middleware] Verify token error:", error);
    return { valid: false };
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieToken = request.cookies.get("access_token")?.value;
  const authHeader = request.headers.get("authorization");
  const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null;
  const accessToken = cookieToken ?? headerToken;
  const isFromCookie = !!cookieToken;

  if (pathname.startsWith("/admin")) {
    console.log("[Middleware] Admin route access attempt:", {
      pathname,
      hasCookieToken: !!cookieToken,
      hasHeaderToken: !!headerToken,
      hasAccessToken: !!accessToken,
    });
    
    if (!accessToken) {
      console.log("[Middleware] No access token in cookie/header, allowing client-side check");
      return NextResponse.next();
    }

    const verification = await verifyToken(accessToken, isFromCookie);
    console.log("[Middleware] Verification result:", {
      valid: verification.valid,
      role: verification.role,
      isAdmin: verification.role === "admin",
    });
    
    if (!verification.valid || verification.role !== "admin") {
      console.log("[Middleware] Access denied, redirecting to /");
      return NextResponse.redirect(new URL("/", request.url));
    }
    
    console.log("[Middleware] Access granted to /admin");
  }

  if (pathname.startsWith("/cabinet")) {
    if (!accessToken) {
      return NextResponse.next();
    }

    const verification = await verifyToken(accessToken, isFromCookie);
    if (!verification.valid) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
