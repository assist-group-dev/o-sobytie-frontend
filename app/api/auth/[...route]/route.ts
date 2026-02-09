import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8276";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  const { route: routeArray } = await params;
  const route = routeArray.join("/");
  const url = `${BACKEND_URL}/api/auth/${route}`;

  try {
    const cookies = request.cookies.toString();
    
    const isLogout = route === "logout";
    let body: string | undefined;
    let contentType: string | undefined;
    
    if (!isLogout) {
      try {
        const requestBody = await request.json();
        body = JSON.stringify(requestBody);
        contentType = "application/json";
      } catch {
      }
    }

    const headers: Record<string, string> = {
      Cookie: cookies,
    };
    
    if (contentType) {
      headers["Content-Type"] = contentType;
    }

    const origin = request.headers.get("origin");
    if (origin) {
      headers["Origin"] = origin;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || `HTTP ${response.status}` };
      }
      return NextResponse.json(
        { message: errorData.message ?? "Backend request failed", ...errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    const nextResponse = NextResponse.json(data, {
      status: response.status,
    });

    const setCookieHeaders = response.headers.getSetCookie();
    setCookieHeaders.forEach((cookie) => {
      const [nameValue, ...rest] = cookie.split(";");
      const [name, value] = nameValue.split("=");
      const options: { [key: string]: string | boolean | number | Date } = {};
      let shouldDelete = false;

      rest.forEach((part) => {
        const trimmed = part.trim();
        if (trimmed.toLowerCase() === "httponly") {
          options.httpOnly = true;
        } else if (trimmed.toLowerCase().startsWith("secure")) {
          options.secure = true;
        } else if (trimmed.toLowerCase().startsWith("samesite")) {
          const sameSite = trimmed.split("=")[1]?.toLowerCase();
          if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
            options.sameSite = sameSite as "lax" | "strict" | "none";
          }
        } else if (trimmed.toLowerCase().startsWith("max-age")) {
          const maxAge = parseInt(trimmed.split("=")[1] ?? "0", 10);
          if (maxAge <= 0) {
            shouldDelete = true;
          } else {
            options.maxAge = maxAge;
          }
        } else if (trimmed.toLowerCase().startsWith("path")) {
          options.path = trimmed.split("=")[1] ?? "/";
        } else if (trimmed.toLowerCase().startsWith("expires")) {
          const expiresValue = trimmed.split("=")[1];
          if (expiresValue) {
            const expiresDate = new Date(expiresValue);
            if (expiresDate < new Date()) {
              shouldDelete = true;
            } else {
              options.expires = expiresDate;
            }
          }
        }
      });

      if (!value || value.trim() === "" || shouldDelete) {
        nextResponse.cookies.delete(name.trim());
      } else {
        nextResponse.cookies.set(name.trim(), value.trim(), options);
      }
    });

    return nextResponse;
  } catch (error) {
    console.error("Error in /api/auth route:", error);
    console.error("Backend URL:", url);
    return NextResponse.json(
      { 
        message: "Internal server error", 
        error: error instanceof Error ? error.message : String(error),
        url: url,
      },
      { status: 500 }
    );
  }
}
