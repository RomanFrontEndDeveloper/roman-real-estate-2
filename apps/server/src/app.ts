import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import { swaggerSpec } from "./config/swagger.js";

import authRoutes from "./features/auth/routes/auth.routes.js";
import profileRoutes from "./features/profile/routes/profile.routes.js";
import propertyRoutes from "./features/property/routes/property.routes.js";
import favoriteRoutes from "./features/favorite/routes/favorite.routes.js";
import agencyRoutes from "./features/agency/routes/agency.routes.js";
import adminRoutes from "./features/admin/routes/admin.routes.js";

import {
  notFoundHandler,
  errorHandler,
} from "./middleware/error.middleware.js";

const app = express();

// 1. HTTP request logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// 2. CORS configuration
const allowedOrigins = (process.env.CLIENT_URL ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header, such as server-to-server requests.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  }),
);

// 3. Parse incoming request data
app.use(express.json());
app.use(cookieParser());

// 4. API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 5. Health check
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

// 6. API routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/agency", agencyRoutes);
app.use("/api/admin", adminRoutes);

// 7. Root endpoint
app.get("/", (_req, res) => {
  res.json({
    message: "Roman Real Estate API",
  });
});

// 8. Handle unknown routes
app.use(notFoundHandler);

// 9. Centralized error handling — must be last
app.use(errorHandler);

export default app;
