import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;

    const response = await fetch(`${BACKEND_URL}/api/eventos/${slug}`, {
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Evento GET proxy error:", error);
    return NextResponse.json(
      { error: "Não foi possível conectar ao servidor." },
      { status: 502 },
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const body = await request.json();
    const authorization = request.headers.get("authorization");

    const response = await fetch(`${BACKEND_URL}/api/eventos/${slug}`, {
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
    console.error("Evento PUT proxy error:", error);
    return NextResponse.json(
      { error: "Não foi possível conectar ao servidor." },
      { status: 502 },
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const authorization = request.headers.get("authorization");

    const response = await fetch(`${BACKEND_URL}/api/eventos/${slug}`, {
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
    console.error("Evento DELETE proxy error:", error);
    return NextResponse.json(
      { error: "Não foi possível conectar ao servidor." },
      { status: 502 },
    );
  }
}
