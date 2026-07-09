import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { param } from "../lib/params";
import { AppError } from "../middleware/errorHandler";

const historiaSchema = z.object({
  titulo: z.string(),
  primeiraParte: z.string(),
  segundaParte: z.string(),
});

const objetivoSchema = z.object({
  titulo: z.string().min(1),
  texto: z.string().min(1),
  icon: z.enum(["heart-handshake", "compass", "sparkles"]).optional(),
});

export async function getHistoria(_req: Request, res: Response): Promise<void> {
  const historia = await prisma.historia.findUnique({
    where: { id: "singleton" },
  });
  res.json(historia);
}

export async function updateHistoria(req: Request, res: Response): Promise<void> {
  const parsed = historiaSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, "Dados inválidos.");
  }

  const historia = await prisma.historia.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...parsed.data },
    update: parsed.data,
  });

  res.json(historia);
}

export async function listObjetivos(_req: Request, res: Response): Promise<void> {
  const objetivos = await prisma.objetivo.findMany({ orderBy: { ordem: "asc" } });
  res.json(objetivos);
}

export async function createObjetivo(req: Request, res: Response): Promise<void> {
  const parsed = objetivoSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, "Dados inválidos.");
  }

  const count = await prisma.objetivo.count();

  const objetivo = await prisma.objetivo.create({
    data: {
      titulo: parsed.data.titulo,
      texto: parsed.data.texto,
      icon: parsed.data.icon ?? "heart-handshake",
      ordem: count,
    },
  });

  res.status(201).json(objetivo);
}

export async function updateObjetivo(req: Request, res: Response): Promise<void> {
  const parsed = objetivoSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, "Dados inválidos.");
  }

  const id = param(req.params.id);

  const existing = await prisma.objetivo.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, "Objetivo não encontrado.");
  }

  const objetivo = await prisma.objetivo.update({
    where: { id },
    data: {
      titulo: parsed.data.titulo,
      texto: parsed.data.texto,
      ...(parsed.data.icon ? { icon: parsed.data.icon } : {}),
    },
  });

  res.json(objetivo);
}

export async function deleteObjetivo(req: Request, res: Response): Promise<void> {
  const id = param(req.params.id);

  const existing = await prisma.objetivo.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, "Objetivo não encontrado.");
  }

  await prisma.objetivo.delete({ where: { id } });
  res.status(204).send();
}
