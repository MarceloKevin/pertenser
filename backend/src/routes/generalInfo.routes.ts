import { Router } from "express";
import {
  getGeneralInfo,
  updateGeneralInfo,
} from "../controllers/generalInfo.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", getGeneralInfo);
router.put("/", authMiddleware, updateGeneralInfo);

export default router;
