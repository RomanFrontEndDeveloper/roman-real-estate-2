import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import authRoutes from "./features/auth/routes/auth.routes.js";
import profileRoutes from "./features/profile/routes/profile.routes.js";
import propertyRoutes from "./features/property/routes/property.routes.js";
import favoriteRoutes from "./features/favorite/routes/favorite.routes.js";
import agencyRoutes from "./features/agency/routes/agency.routes.js";
import adminRoutes from "./features/admin/routes/admin.routes.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

import {
  notFoundHandler,
  errorHandler,
} from "./middleware/error.middleware.js";

const app = express();

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, //Це дозволяє browser запитам працювати з credentials/cookies.
  }),
);

app.use(express.json()); //Це дозволяє працювати з JSON у запитах.

app.use(cookieParser()); //Це дозволяє працювати з cookies у запитах.

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use("/api/auth", authRoutes); //Це дозволяє працювати з роутами для авторизації.

app.use("/api/profile", profileRoutes); //Це дозволяє працювати з роутами для профілю.

app.use("/api/properties", propertyRoutes);

app.use("/api/favorites", favoriteRoutes);
app.use("/api/agency", agencyRoutes);

app.use("/api/admin", adminRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "Roman Real Estate API",
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
