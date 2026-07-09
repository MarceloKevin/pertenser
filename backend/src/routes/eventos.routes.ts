import { Router } from "express";
import {
  listEventos,
  getEventoBySlug,
  createEvento,
  updateEvento,
  deleteEvento,
} from "../controllers/eventos.controller";
import {
  listVideosEvento,
  createVideoEvento,
  updateVideoEvento,
  deleteVideoEvento,
} from "../controllers/videosEvento.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", listEventos);
router.get("/:slug/videos", listVideosEvento);
router.post("/:slug/videos", authMiddleware, createVideoEvento);
router.put("/:slug/videos/:id", authMiddleware, updateVideoEvento);
router.delete("/:slug/videos/:id", authMiddleware, deleteVideoEvento);
router.get("/:slug", getEventoBySlug);
router.post("/", authMiddleware, createEvento);
router.put("/:slug", authMiddleware, updateEvento);
router.delete("/:slug", authMiddleware, deleteEvento);

export default router;
