import { Server } from "socket.io";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

let io;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN.split(",").map((s) => s.trim()),
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    // Client should emit: auth:join with { userId }
    socket.on("auth:join", ({ userId }) => {
      if (!userId) return;
      socket.join(`user:${userId}`);
    });

    socket.on("disconnect", () => {});
  });

  logger.info("Socket.IO initialized");
}

export function emitToUser(userId, event, payload) {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, payload);
}
