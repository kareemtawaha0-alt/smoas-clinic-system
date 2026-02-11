import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { initSocket } from "./socket/socket.js";
import { logger } from "./utils/logger.js";

const server = http.createServer(app);

async function bootstrap() {
  await connectDB(env.MONGO_URI);

  initSocket(server);

  server.listen(env.PORT, () => {
    logger.info(`API running on port ${env.PORT} (${env.NODE_ENV})`);
  });
}

bootstrap().catch((err) => {
  logger.error(err);
  process.exit(1);
});
