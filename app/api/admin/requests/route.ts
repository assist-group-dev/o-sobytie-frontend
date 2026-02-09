import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8276";

export async function GET(request: NextRequest) {
  const url = `${BACKEND_URL}/api/v1/admin/requests`;

  try {
    const cookies = request.cookies.toString();

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Cookie: cookies,
      },
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
