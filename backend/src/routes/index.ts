import { Router } from "express";
import authRoutes from "./auth.routes";
import generalInfoRoutes from "./generalInfo.routes";
import proximoEventoRoutes from "./proximoEvento.routes";
import eventosRoutes from "./eventos.routes";
import duvidasRoutes from "./duvidas.routes";
import historiaRoutes from "./historia.routes";
import uploadRoutes from "./upload.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/general-info", generalInfoRoutes);
router.use("/proximo-evento", proximoEventoRoutes);
router.use("/eventos", eventosRoutes);
router.use("/duvidas", duvidasRoutes);
router.use("/historia", historiaRoutes);
router.use("/upload", uploadRoutes);

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;
