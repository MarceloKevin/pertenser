import { Router } from "express";
import {
  getHistoria,
  updateHistoria,
  listObjetivos,
  createObjetivo,
  updateObjetivo,
  deleteObjetivo,
} from "../controllers/historia.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", getHistoria);
router.put("/", authMiddleware, updateHistoria);

router.get("/objetivos", listObjetivos);
router.post("/objetivos", authMiddleware, createObjetivo);
router.put("/objetivos/:id", authMiddleware, updateObjetivo);
router.delete("/objetivos/:id", authMiddleware, deleteObjetivo);

export default router;
