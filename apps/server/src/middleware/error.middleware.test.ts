import { afterEach, describe, expect, it, vi } from "vitest";
import type { Request, Response } from "express";
import { ZodError, z } from "zod";
import { MulterError } from "multer";

import { ApiError } from "../features/auth/utils/api-error.js";
import { errorHandler, notFoundHandler } from "./error.middleware.js";

describe("notFoundHandler", () => {
  it("повертає 404 для неіснуючого маршруту", () => {
    const req = {
      method: "GET",
      originalUrl: "/api/unknown",
    } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;

    notFoundHandler(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Route not found: GET /api/unknown",
    });
  });
});

describe("errorHandler", () => {
  const createResponse = () =>
    ({
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    }) as unknown as Response;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("обробляє ApiError", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = createResponse();
   const error = new ApiError("Forbidden", 403);

    errorHandler(error, {} as Request, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Forbidden",
    });
  });

  it("повертає 400 для ZodError", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const result = z.string().safeParse(123);
    if (result.success) throw new Error("Expected validation failure");

    const res = createResponse();

    errorHandler(result.error, {} as Request, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Validation failed",
      errors: result.error.issues,
    });
  });

  it("повертає 400 для MulterError", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = createResponse();
    const error = new MulterError("LIMIT_FILE_SIZE");

    errorHandler(error, {} as Request, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: error.message,
    });
  });

  it("повертає 500 для невідомої помилки", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = createResponse();

    errorHandler(
      new Error("Database connection failed"),
      {} as Request,
      res,
      vi.fn(),
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal server error",
    });
  });
});
