import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";

import authRoutes from "./features/auth/routes/auth.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, //Це дозволяє browser запитам працювати з credentials/cookies.
  }),
);

app.use(express.json());//Це дозволяє працювати з JSON у запитах.

app.use(cookieParser());//Це дозволяє працювати з cookies у запитах.

app.use("/api/auth", authRoutes);//Це дозволяє працювати з роутами для авторизації.

app.get("/", (_req, res) => {
  res.json({
    message: "Roman Real Estate API",
  });
});

export default app;
