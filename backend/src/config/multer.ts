import path from "path";
import fs from "fs";
import multer from "multer";
import { env } from "../config/env";

const ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

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

function createStorage(subfolder: string) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      const slug = (_req.body?.slug as string) ?? "geral";
      const folder = (_req.body?.folder as string) === "galeria" ? "galeria" : "";
      const dir = path.join(
        env.UPLOAD_DIR,
        "eventos",
        slug,
        subfolder || folder,
      );
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      cb(null, buildFilename(file.originalname));
    },
  });
}

const maxSize = env.MAX_FILE_SIZE_MB * 1024 * 1024;

function fileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  if (!ALLOWED_MIMES.has(file.mimetype)) {
    cb(new Error("Formato não suportado. Use JPG, PNG, WebP ou GIF."));
    return;
  }
  cb(null, true);
}

export const uploadEvento = multer({
  storage: createStorage(""),
  limits: { fileSize: maxSize },
  fileFilter,
});
