import "dotenv/config";
import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`Servidor rodando em http://localhost:${env.PORT}`);
  console.log(`API disponível em http://localhost:${env.PORT}/api`);
  console.log(`Uploads servidos em http://localhost:${env.PORT}/uploads`);
});
