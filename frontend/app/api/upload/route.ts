import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_SIZE = 5 * 1024 * 1024;
const VALID_EXTS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

function buildFilename(originalName: string): string {
  const ext = originalName.split(".").pop()?.toLowerCase() ?? "jpg";
  if (!VALID_EXTS.has(ext)) {
    throw new Error("Extensão não suportada.");
  }

  const normalizedExt = ext === "jpeg" ? "jpg" : ext;
  const baseName =
    originalName
      .replace(/\.[^.]+$/, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9-_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase() || "imagem";

  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

  return `${baseName}_${timestamp}.${normalizedExt}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const slug = formData.get("slug");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado." },
        { status: 400 },
      );
    }

    if (typeof slug !== "string" || !/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: "Slug inválido." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Formato não suportado. Use JPG, PNG, WebP ou GIF." },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Máximo: 5 MB." },
        { status: 400 },
      );
    }

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    if (!VALID_EXTS.has(ext)) {
      return NextResponse.json(
        { error: "Extensão não suportada." },
        { status: 400 },
      );
    }

    const filename = buildFilename(file.name);
    const folder = formData.get("folder");
    const subfolder = folder === "galeria" ? "galeria" : "";

    if (typeof folder === "string" && folder && folder !== "galeria") {
      return NextResponse.json({ error: "Pasta inválida." }, { status: 400 });
    }

    const dir = path.join(process.cwd(), "public", "eventos", slug, subfolder);
    await mkdir(dir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, filename), buffer);

    const url = subfolder
      ? `/eventos/${slug}/galeria/${filename}`
      : `/eventos/${slug}/${filename}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Erro ao fazer upload da imagem." },
      { status: 500 },
    );
  }
}
