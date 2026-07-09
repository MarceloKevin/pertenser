import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { param } from "../lib/params";
import { AppError } from "../middleware/errorHandler";

const videoEventoSchema = z.object({
  titulo: z.string(),
  url: z.string().min(1),
  ordem: z.number().int().optional(),
});

async function getEventoOrThrow(slug: string) {
  const evento = await prisma.eventoRealizado.findUnique({ where: { slug } });
  if (!evento) {
    throw new AppError(404, "Evento não encontrado.");
  }
  return evento;
}

export async function listVideosEvento(req: Request, res: Response): Promise<void> {
  const slug = param(req.params.slug);
  const evento = await getEventoOrThrow(slug);

  const videos = await prisma.videosEvento.findMany({
    where: { eventoId: evento.id },
    orderBy: { ordem: "asc" },
  });

  res.json(videos);
}

export async function createVideoEvento(req: Request, res: Response): Promise<void> {
  const parsed = videoEventoSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, "Dados inválidos.");
  }

  const slug = param(req.params.slug);
  const evento = await getEventoOrThrow(slug);

  const count = await prisma.videosEvento.count({ where: { eventoId: evento.id } });

  const video = await prisma.videosEvento.create({
    data: {
      titulo: parsed.data.titulo,
      url: parsed.data.url,
      ordem: parsed.data.ordem ?? count,
      eventoId: evento.id,
    },
  });

  res.status(201).json(video);
}

export async function updateVideoEvento(req: Request, res: Response): Promise<void> {
  const parsed = videoEventoSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, "Dados inválidos.");
  }

  const slug = param(req.params.slug);
  const id = param(req.params.id);
  const evento = await getEventoOrThrow(slug);

  const existing = await prisma.videosEvento.findFirst({
    where: { id, eventoId: evento.id },
  });
  if (!existing) {
    throw new AppError(404, "Vídeo não encontrado.");
  }

  const video = await prisma.videosEvento.update({
    where: { id },
    data: parsed.data,
  });

  res.json(video);
}

export async function deleteVideoEvento(req: Request, res: Response): Promise<void> {
  const slug = param(req.params.slug);
  const id = param(req.params.id);
  const evento = await getEventoOrThrow(slug);

  const existing = await prisma.videosEvento.findFirst({
    where: { id, eventoId: evento.id },
  });
  if (!existing) {
    throw new AppError(404, "Vídeo não encontrado.");
  }

  await prisma.videosEvento.delete({ where: { id } });
  res.status(204).send();
}
