import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

function getContentType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return MIME[ext] ?? "application/octet-stream";
}

type RouteContext = {
  params: Promise<{ slug: string; asset: string[] }>;
};

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, context: RouteContext) {
  const { slug, asset } = await context.params;

  if (!/^[a-z0-9-]+$/.test(slug) || !asset?.length) {
    return new NextResponse(null, { status: 404 });
  }

  const relativePath = asset.join("/");
  if (relativePath.includes("..")) {
    return new NextResponse(null, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "public", "eventos", slug, ...asset);

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      return new NextResponse(null, { status: 404 });
    }

    const buffer = await readFile(filePath);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": getContentType(relativePath),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
