import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { param } from "../lib/params";
import { AppError } from "../middleware/errorHandler";

const depoimentoSchema = z.object({
  nome: z.string(),
  texto: z.string(),
});

const videoEventoSchema = z.object({
  titulo: z.string(),
  url: z.string().min(1),
  ordem: z.number().int(),
});

const eventoSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  nome: z.string().min(1),
  data: z.string(),
  dataFormatada: z.string(),
  resumo: z.string(),
  descricaoCompleta: z.string(),
  objetivo: z.string(),
  momentosMarcantes: z.array(z.string()),
  imagemDestaque: z.string(),
  galeria: z.array(z.string()),
  depoimentos: z.array(depoimentoSchema),
  videos: z.array(videoEventoSchema),
});

const createEventoSchema = z.object({
  nome: z.string().min(1),
  data: z.string(),
});

type EventoWithRelations = {
  slug: string;
  nome: string;
  data: string;
  dataFormatada: string;
  resumo: string;
  descricaoCompleta: string;
  objetivo: string;
  momentosMarcantes: string[];
  imagemDestaque: string;
  galeria: string[];
  depoimentos: { nome: string; texto: string }[];
  videos: { titulo: string; url: string; ordem: number }[];
};

function normalizeEventoImageUrl(url: string): string {
  if (url.startsWith("/uploads/eventos/")) {
    return url.replace("/uploads/eventos/", "/eventos/");
  }
  return url;
}

function formatEvento(evento: EventoWithRelations) {
  return {
    slug: evento.slug,
    nome: evento.nome,
    data: evento.data,
    dataFormatada: evento.dataFormatada,
    resumo: evento.resumo,
    descricaoCompleta: evento.descricaoCompleta,
    objetivo: evento.objetivo,
    momentosMarcantes: evento.momentosMarcantes,
    imagemDestaque: normalizeEventoImageUrl(evento.imagemDestaque),
    galeria: evento.galeria.map(normalizeEventoImageUrl),
    depoimentos: evento.depoimentos.map((d) => ({
      nome: d.nome,
      texto: d.texto,
    })),
    videos: evento.videos
      .slice()
      .sort((a, b) => a.ordem - b.ordem)
      .map((v) => ({
        titulo: v.titulo,
        url: v.url,
        ordem: v.ordem,
      })),
  };
}

export async function listEventos(_req: Request, res: Response): Promise<void> {
  const eventos = await prisma.eventoRealizado.findMany({
    include: { depoimentos: true, videos: true },
    orderBy: { data: "desc" },
  });

  res.json(eventos.map(formatEvento));
}

export async function getEventoBySlug(req: Request, res: Response): Promise<void> {
  const slug = param(req.params.slug);
  const evento = await prisma.eventoRealizado.findUnique({
    where: { slug },
    include: { depoimentos: true, videos: true },
  });

  if (!evento) {
    throw new AppError(404, "Evento não encontrado.");
  }

  res.json(formatEvento(evento));
}

export async function createEvento(req: Request, res: Response): Promise<void> {
  const parsed = createEventoSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, "Dados inválidos.");
  }

  const { nome, data } = parsed.data;
  const slug = await generateUniqueSlug(nome);

  const MESES = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
  ];
  const [year, month, day] = data.split("-").map(Number);
  const dataFormatada = year && month && day
    ? `${String(day).padStart(2, "0")} de ${MESES[month - 1]} de ${year}`
    : data;

  const evento = await prisma.eventoRealizado.create({
    data: {
      slug,
      nome,
      data,
      dataFormatada,
    },
    include: { depoimentos: true, videos: true },
  });

  res.status(201).json(formatEvento(evento));
}

export async function updateEvento(req: Request, res: Response): Promise<void> {
  const parsed = eventoSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, "Dados inválidos.");
  }

  const slug = param(req.params.slug);
  const data = parsed.data;

  const existing = await prisma.eventoRealizado.findUnique({ where: { slug } });
  if (!existing) {
    throw new AppError(404, "Evento não encontrado.");
  }

  await prisma.depoimento.deleteMany({ where: { eventoId: existing.id } });
  await prisma.videosEvento.deleteMany({ where: { eventoId: existing.id } });

  const evento = await prisma.eventoRealizado.update({
    where: { slug },
    data: {
      nome: data.nome,
      data: data.data,
      dataFormatada: data.dataFormatada,
      resumo: data.resumo,
      descricaoCompleta: data.descricaoCompleta,
      objetivo: data.objetivo,
      momentosMarcantes: data.momentosMarcantes,
      imagemDestaque: data.imagemDestaque,
      galeria: data.galeria,
      depoimentos: {
        create: data.depoimentos,
      },
      videos: {
        create: data.videos,
      },
    },
    include: { depoimentos: true, videos: true },
  });

  res.json(formatEvento(evento));
}

export async function deleteEvento(req: Request, res: Response): Promise<void> {
  const slug = param(req.params.slug);

  const existing = await prisma.eventoRealizado.findUnique({ where: { slug } });
  if (!existing) {
    throw new AppError(404, "Evento não encontrado.");
  }

  await prisma.eventoRealizado.delete({ where: { slug } });
  res.status(204).send();
}

async function generateUniqueSlug(nome: string): Promise<string> {
  const base = nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "evento";

  let slug = base;
  let counter = 2;

  while (await prisma.eventoRealizado.findUnique({ where: { slug } })) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
}
