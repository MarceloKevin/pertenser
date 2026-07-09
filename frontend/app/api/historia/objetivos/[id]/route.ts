import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const authorization = request.headers.get("authorization");

    const response = await fetch(`${BACKEND_URL}/api/historia/objetivos/${id}`, {
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
    console.error("Objetivo PUT proxy error:", error);
    return NextResponse.json(
      { error: "Não foi possível conectar ao servidor." },
      { status: 502 },
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const authorization = request.headers.get("authorization");

    const response = await fetch(`${BACKEND_URL}/api/historia/objetivos/${id}`, {
      method: "DELETE",
      headers: {
        ...(authorization ? { Authorization: authorization } : {}),
      },
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Objetivo DELETE proxy error:", error);
    return NextResponse.json(
      { error: "Não foi possível conectar ao servidor." },
      { status: 502 },
    );
  }
}
