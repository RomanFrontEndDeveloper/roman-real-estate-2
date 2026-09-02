import cors from "cors";
import express from "express";

import authRoutes from "./features/auth/routes/auth.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "Roman Real Estate API",
  });
});

export default app;