import path from "path";
import express from "express";
import cors from "cors";
import { env } from "./config/env";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    }),
  );

  app.use(express.json());

  app.use(
    "/uploads",
    express.static(path.resolve(env.UPLOAD_DIR)),
  );

  app.use("/api", routes);

  app.use(errorHandler);

  return app;
}
