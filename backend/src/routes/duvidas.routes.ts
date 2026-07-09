import { Router } from "express";
import {
  listDuvidas,
  createDuvida,
  updateDuvida,
  deleteDuvida,
} from "../controllers/duvidas.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", listDuvidas);
router.post("/", authMiddleware, createDuvida);
router.put("/:id", authMiddleware, updateDuvida);
router.delete("/:id", authMiddleware, deleteDuvida);

export default router;
