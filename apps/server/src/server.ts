import "dotenv/config";

import { createServer } from "node:http";
import { Server } from "socket.io";

import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { authenticateSocket } from "./middleware/socket-auth.middleware.js";
import { redisClient } from "./shared/redis/redis.client.js";

const PORT = Number(process.env.PORT) || 5000;

const startServer = async (): Promise<void> => {
  await connectDatabase();

  await redisClient.connect();
  console.log("Redis connected successfully");

  const httpServer = createServer(app);

  const allowedOrigins = (process.env.CLIENT_URL ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    void authenticateSocket(socket, (error) => {
      if (error) {
        console.error("Socket authentication failed:", error.message);
      }

      next(error);
    });
  });

  io.on("connection", (socket) => {
    const { userId } = socket.data.user;

    socket.join(`user:${userId}`);

    console.log(`Socket connected: ${socket.id}, user: ${userId}`);

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id}. Reason: ${reason}`);
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  const shutdown = () => {
    httpServer.close(() => {
      io.close();
      void redisClient.quit();
    });
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);

  if (redisClient.isOpen) {
    void redisClient.quit().finally(() => process.exit(1));
  } else {
    process.exit(1);
  }
});
