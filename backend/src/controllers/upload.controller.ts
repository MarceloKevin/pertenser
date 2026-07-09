import { Request, Response } from "express";
import path from "path";
import { AppError } from "../middleware/errorHandler";

export async function uploadImage(req: Request, res: Response): Promise<void> {
  const slug = req.body?.slug as string | undefined;
  const folder = req.body?.folder as string | undefined;

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    throw new AppError(400, "Slug inválido.");
  }

  if (folder && folder !== "galeria") {
    throw new AppError(400, "Pasta inválida.");
  }

  if (!req.file) {
    throw new AppError(400, "Nenhum arquivo enviado.");
  }

  const subfolder = folder === "galeria" ? "galeria" : "";
  const url = subfolder
    ? `/uploads/eventos/${slug}/galeria/${req.file.filename}`
    : `/uploads/eventos/${slug}/${req.file.filename}`;

  res.json({ url });
}
