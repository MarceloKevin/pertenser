import { Router } from "express";
import {
  getProximoEvento,
  getProximoEventoAdmin,
  updateProximoEvento,
} from "../controllers/proximoEvento.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", getProximoEvento);
router.get("/admin", authMiddleware, getProximoEventoAdmin);
router.put("/", authMiddleware, updateProximoEvento);

export default router;
