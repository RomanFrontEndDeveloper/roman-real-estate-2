import { describe, expect, it, vi } from "vitest";

import type { Request, Response, NextFunction } from "express";

import { validateUpdateProperty } from "./validate-update-property.js";

describe("validateUpdateProperty", () => {
  const validBody = {
    title: "Modern apartment",
    description: "Comfortable apartment",
    price: "120000",
    currency: "USD",
    listingType: "sale",
    location: "Khmelnytskyi",
    propertyType: "apartment",
    bedrooms: "2",
    kitchenArea: "12",
    area: "65",
  };

  const createMocks = (body: unknown) => {
    const req = { body } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;

    const next = vi.fn() as NextFunction;

    return { req, res, next };
  };

  it("викликає next для валідних даних", () => {
    const { req, res, next } = createMocks(validBody);

    validateUpdateProperty(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("повертає 400 для невалідних даних", () => {
    const { req, res, next } = createMocks({
      ...validBody,
      price: "-100",
    });

    validateUpdateProperty(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Validation failed",
        errors: expect.any(Object),
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("перетворює числові рядки на числа в req.body", () => {
    const { req, next } = createMocks(validBody);

    validateUpdateProperty(req, {} as Response, next);

    expect(req.body.price).toBe(120000);
    expect(req.body.bedrooms).toBe(2);
    expect(req.body.kitchenArea).toBe(12);
    expect(req.body.area).toBe(65);
    expect(next).toHaveBeenCalledOnce();
  });

  it("не викликає next, якщо площа не більша за площу кухні", () => {
    const { req, res, next } = createMocks({
      ...validBody,
      area: "12",
      kitchenArea: "12",
    });

    validateUpdateProperty(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });
});
