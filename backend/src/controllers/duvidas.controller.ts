import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { param } from "../lib/params";
import { AppError } from "../middleware/errorHandler";

const duvidaSchema = z.object({
  pergunta: z.string().min(1),
  resposta: z.string().min(1),
});

export async function listDuvidas(_req: Request, res: Response): Promise<void> {
  const duvidas = await prisma.duvida.findMany({ orderBy: { ordem: "asc" } });
  res.json(duvidas);
}

export async function createDuvida(req: Request, res: Response): Promise<void> {
  const parsed = duvidaSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, "Dados inválidos.");
  }

  const count = await prisma.duvida.count();

  const duvida = await prisma.duvida.create({
    data: { ...parsed.data, ordem: count },
  });

  res.status(201).json(duvida);
}

export async function updateDuvida(req: Request, res: Response): Promise<void> {
  const parsed = duvidaSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, "Dados inválidos.");
  }

  const id = param(req.params.id);

  const existing = await prisma.duvida.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, "Dúvida não encontrada.");
  }

  const duvida = await prisma.duvida.update({
    where: { id },
    data: parsed.data,
  });

  res.json(duvida);
}

export async function deleteDuvida(req: Request, res: Response): Promise<void> {
  const id = param(req.params.id);

  const existing = await prisma.duvida.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, "Dúvida não encontrada.");
  }

  await prisma.duvida.delete({ where: { id } });
  res.status(204).send();
}
