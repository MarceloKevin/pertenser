import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";

const generalInfoSchema = z.object({
  whatsapp: z.string(),
  email: z.string().email(),
  instagram: z.string().url(),
  facebook: z.string().url(),
  youtube: z.string().url(),
});

export async function getGeneralInfo(_req: Request, res: Response): Promise<void> {
  const info = await prisma.generalInfo.findUnique({
    where: { id: "singleton" },
  });
  res.json(info);
}

export async function updateGeneralInfo(req: Request, res: Response): Promise<void> {
  const parsed = generalInfoSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, "Dados inválidos.");
  }

  const info = await prisma.generalInfo.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...parsed.data },
    update: parsed.data,
  });

  res.json(info);
}
