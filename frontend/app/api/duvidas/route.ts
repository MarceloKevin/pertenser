import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/duvidas`, {
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Duvidas GET proxy error:", error);
    return NextResponse.json(
      { error: "Não foi possível conectar ao servidor." },
      { status: 502 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authorization = request.headers.get("authorization");

    const response = await fetch(`${BACKEND_URL}/api/duvidas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authorization ? { Authorization: authorization } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Duvidas POST proxy error:", error);
    return NextResponse.json(
      { error: "Não foi possível conectar ao servidor." },
      { status: 502 },
    );
  }
}
