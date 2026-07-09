import { Router } from "express";
import { uploadImage } from "../controllers/upload.controller";
import { authMiddleware } from "../middleware/auth";
import { uploadEvento } from "../config/multer";

const router = Router();

router.post(
  "/",
  authMiddleware,
  uploadEvento.single("file"),
  uploadImage,
);

export default router;
