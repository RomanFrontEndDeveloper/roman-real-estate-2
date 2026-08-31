import "dotenv/config";
import express from "express";
import { connectDatabase } from "./config/database.js";

const app = express();

const PORT = 5000;

app.get("/", (_req, res) => {
  res.json({
    message: "Roman Real Estate API",
  });
});

const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
