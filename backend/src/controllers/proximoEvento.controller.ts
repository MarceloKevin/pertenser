import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";

const proximoEventoSchema = z.object({
  ativo: z.boolean(),
  nome: z.string(),
  descricao: z.string(),
  local: z.string(),
  data: z.string(),
  horario: z.string(),
  imagem: z.string(),
});

export async function getProximoEvento(_req: Request, res: Response): Promise<void> {
  const evento = await prisma.proximoEvento.findUnique({
    where: { id: "singleton" },
  });

  if (!evento || !evento.ativo) {
    res.json(null);
    return;
  }

  res.json({
    nome: evento.nome,
    descricao: evento.descricao,
    local: evento.local,
    data: evento.data,
    horario: evento.horario,
    imagem: evento.imagem,
  });
}

export async function getProximoEventoAdmin(
  _req: Request,
  res: Response,
): Promise<void> {
  const evento = await prisma.proximoEvento.findUnique({
    where: { id: "singleton" },
  });
  res.json(evento);
}

export async function updateProximoEvento(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = proximoEventoSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, "Dados inválidos.");
  }

  const evento = await prisma.proximoEvento.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...parsed.data },
    update: parsed.data,
  });

  res.json(evento);
}
