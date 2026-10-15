import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { MulterError } from "multer";

import { ApiError } from "../features/auth/utils/api-error.js";

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error);

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });

    return;
  } // ApiError — помилка, яку ти контролюєш

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues,
    });

    return;
  } // ZodError — помилка валідації

  if (error instanceof MulterError) {
    res.status(400).json({
      success: false,
      message: error.message,
    });

    return;
  } // MulterError — помилка завантаження файлів

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
