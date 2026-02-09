import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8276";

export async function GET(request: NextRequest) {
  const url = `${BACKEND_URL}/api/admin/counterparties`;

  try {
    const cookies = request.cookies.toString();
    const origin = request.headers.get("origin");

    const headers: Record<string, string> = {
      Cookie: cookies,
    };

    if (origin) {
      headers["Origin"] = origin;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
      credentials: "include",
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const url = `${BACKEND_URL}/api/admin/counterparties`;

  try {
    const body = await request.json();
    const cookies = request.cookies.toString();
    const origin = request.headers.get("origin");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Cookie: cookies,
    };

    if (origin) {
      headers["Origin"] = origin;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      credentials: "include",
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}
