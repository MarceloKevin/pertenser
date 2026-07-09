import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get("authorization");

    const response = await fetch(`${BACKEND_URL}/api/proximo-evento/admin`, {
      cache: "no-store",
      headers: {
        ...(authorization ? { Authorization: authorization } : {}),
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proximo evento admin GET proxy error:", error);
    return NextResponse.json(
      { error: "Não foi possível conectar ao servidor." },
      { status: 502 },
    );
  }
}
