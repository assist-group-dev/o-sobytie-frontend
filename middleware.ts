import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
const MAINTENANCE_CACHE_TTL_MS = 60 * 1000;

let maintenanceCache: {
  data: { enabled: boolean; message: string } | null;
  timestamp: number;
} = { data: null, timestamp: 0 };

async function getMaintenanceState(): Promise<{ enabled: boolean; message: string }> {
  const now = Date.now();
  if (
    maintenanceCache.data != null &&
    now - maintenanceCache.timestamp < MAINTENANCE_CACHE_TTL_MS
  ) {
    return maintenanceCache.data;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/settings/maintenance`, {
      credentials: "include",
    });
    if (response.ok) {
      const data = (await response.json()) as { enabled: boolean; message: string };
      maintenanceCache = { data, timestamp: now };
      return data;
    }
  } catch {
    // treat as disabled on error
  }
  maintenanceCache = { data: { enabled: false, message: "" }, timestamp: now };
  return { enabled: false, message: "" };
}

async function verifyToken(
  token: string,
  isFromCookie: boolean
): Promise<{ valid: boolean; role?: string }> {
  try {
    const headers: Record<string, string> = {};

    if (isFromCookie) {
      headers.Cookie = `access_token=${token}`;
    } else {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "GET",
      headers,
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
  const cookieToken = request.cookies.get("access_token")?.value;
  const authHeader = request.headers.get("authorization");
  const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null;
  const accessToken = cookieToken ?? headerToken;
  const isFromCookie = !!cookieToken;

  if (pathname === "/maintenance") {
    const maintenance = await getMaintenanceState();
    if (!maintenance.enabled) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!accessToken) {
      return NextResponse.next();
    }

    const verification = await verifyToken(accessToken, isFromCookie);

    if (!verification.valid || verification.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/cabinet")) {
    if (!accessToken) {
      return NextResponse.next();
    }

    const verification = await verifyToken(accessToken, isFromCookie);
    if (!verification.valid) {
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  const maintenance = await getMaintenanceState();
  if (maintenance.enabled) {
    const isAdmin =
      accessToken != null &&
      (await verifyToken(accessToken, isFromCookie)).role === "admin";
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/maintenance", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
