import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/proximo-evento`, {
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proximo evento GET proxy error:", error);
    return NextResponse.json(
      { error: "Não foi possível conectar ao servidor." },
      { status: 502 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const authorization = request.headers.get("authorization");

    const response = await fetch(`${BACKEND_URL}/api/proximo-evento`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(authorization ? { Authorization: authorization } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proximo evento PUT proxy error:", error);
    return NextResponse.json(
      { error: "Não foi possível conectar ao servidor." },
      { status: 502 },
    );
  }
}
