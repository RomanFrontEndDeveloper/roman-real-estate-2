import { beforeEach, describe, expect, it, vi } from "vitest";

const { propertyService, uploadPropertyImage } = vi.hoisted(() => ({
  propertyService: {
    getProperties: vi.fn(),
    countProperties: vi.fn(),
    getMyProperties: vi.fn(),
    getPropertyById: vi.fn(),
    getPropertyByIdWithoutOwner: vi.fn(),
    createProperty: vi.fn(),
    updateProperty: vi.fn(),
    deleteProperty: vi.fn(),
  },
  uploadPropertyImage: vi.fn(),
}));

vi.mock("../services/property.service.js", () => propertyService);

vi.mock("../utils/upload-property-images.js", () => ({
  uploadPropertyImage,
}));

import {
  getProperties,
  getMyProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from "./property.controller.js";

import type { Request, Response, NextFunction } from "express";

describe("property.controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();

    req = {
      query: {},
      params: {},
      body: {},
      user: { userId: "user-123" } as Request["user"],
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    next = vi.fn();
  });

  describe("getProperties", () => {
    it("повертає оголошення та інформацію про пагінацію", async () => {
      const properties = [{ _id: "property-1", price: 100000 }];

      propertyService.getProperties.mockResolvedValue(properties);
      propertyService.countProperties.mockResolvedValue(1);

      req.query = { page: "1", limit: "6" };

      await getProperties(req as Request, res as Response, next);

      expect(propertyService.getProperties).toHaveBeenCalledWith({}, {}, 0, 6);

      expect(propertyService.countProperties).toHaveBeenCalledWith({});

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: properties,
        pagination: {
          page: 1,
          limit: 6,
          total: 1,
          totalPages: 1,
        },
      });

      expect(next).not.toHaveBeenCalled();
    });

    it("передає фільтр ціни та сортування до сервісу", async () => {
      propertyService.getProperties.mockResolvedValue([]);
      propertyService.countProperties.mockResolvedValue(0);

      req.query = {
        minPrice: "50000",
        maxPrice: "200000",
        sortBy: "price-asc",
      };

      await getProperties(req as Request, res as Response, next);

      expect(propertyService.getProperties).toHaveBeenCalledWith(
        {
          price: {
            $gte: 50000,
            $lte: 200000,
          },
        },
        { price: 1 },
        0,
        6,
      );
    });

    it("передає помилку в middleware, якщо сервіс завершується помилкою", async () => {
      const error = new Error("Database error");

      propertyService.getProperties.mockRejectedValue(error);

      await getProperties(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getMyProperties", () => {
    it("повертає оголошення поточного користувача", async () => {
      const properties = [{ _id: "property-1" }];

      propertyService.getMyProperties.mockResolvedValue(properties);

      await getMyProperties(req as Request, res as Response, next);

      expect(propertyService.getMyProperties).toHaveBeenCalledWith("user-123");

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: properties,
      });
    });

    it("повертає 401, якщо користувач не авторизований", async () => {
      req.user = undefined;

      await getMyProperties(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Authentication required",
      });

      expect(propertyService.getMyProperties).not.toHaveBeenCalled();
    });
  });

  describe("getPropertyById", () => {
    it("повертає оголошення за ID", async () => {
      const property = { _id: "property-1", price: 100000 };

      req.params = { id: "property-1" };
      propertyService.getPropertyById.mockResolvedValue(property);

      await getPropertyById(req as Request, res as Response, next);

      expect(propertyService.getPropertyById).toHaveBeenCalledWith(
        "property-1",
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: property,
      });
    });

    it("передає помилку сервісу в next", async () => {
      const error = new Error("Property not found");

      propertyService.getPropertyById.mockRejectedValue(error);

      await getPropertyById(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("createProperty", () => {
    it("повертає 401, якщо користувач не авторизований", async () => {
      req.user = undefined;

      await createProperty(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(propertyService.createProperty).not.toHaveBeenCalled();
    });

    it("створює оголошення без фотографій", async () => {
      const property = { _id: "property-1", title: "Квартира" };

      req.body = { title: "Квартира", price: "100000" };
      req.files = {};

      propertyService.createProperty.mockResolvedValue(property);

      await createProperty(req as Request, res as Response, next);

      expect(propertyService.createProperty).toHaveBeenCalledWith({
        title: "Квартира",
        price: "100000",
        owner: "user-123",
        mainImage: "",
        images: [],
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: property,
      });
    });

    it("передає помилку, якщо створення оголошення не вдалося", async () => {
      const error = new Error("Create failed");

      propertyService.createProperty.mockRejectedValue(error);

      await createProperty(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("updateProperty", () => {
    it("забороняє оновлення чужого оголошення", async () => {
      req.params = { id: "property-1" };

      propertyService.getPropertyByIdWithoutOwner.mockResolvedValue({
        _id: "property-1",
        owner: { toString: () => "another-user" },
      });

      await updateProperty(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(propertyService.updateProperty).not.toHaveBeenCalled();
    });

    it("успішно оновлює власне оголошення", async () => {
      const updatedProperty = {
        _id: "property-1",
        title: "Оновлена квартира",
        price: 120000,
      };

      req.params = { id: "property-1" };
      req.body = {
        title: "Оновлена квартира",
        price: "120000",
        currency: "USD",
        listingType: "sale",
        location: "Хмельницький",
        propertyType: "apartment",
        bedrooms: "2",
        kitchenArea: "12",
        area: "65",
      };
      req.files = {};

      propertyService.getPropertyByIdWithoutOwner.mockResolvedValue({
        _id: "property-1",
        owner: { toString: () => "user-123" },
      });

      propertyService.updateProperty.mockResolvedValue(updatedProperty);

      await updateProperty(req as Request, res as Response, next);

      expect(propertyService.updateProperty).toHaveBeenCalledWith(
        "property-1",
        "user-123",
        expect.objectContaining({
          title: "Оновлена квартира",
          price: 120000,
          currency: "USD",
          location: "Хмельницький",
          bedrooms: 2,
          area: 65,
          images: [],
        }),
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: updatedProperty,
      });

      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("deleteProperty", () => {
    it("забороняє видалення чужого оголошення", async () => {
      req.params = { id: "property-1" };

      propertyService.getPropertyByIdWithoutOwner.mockResolvedValue({
        _id: "property-1",
        owner: { toString: () => "another-user" },
      });

      await deleteProperty(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(propertyService.deleteProperty).not.toHaveBeenCalled();
    });

    it("успішно видаляє власне оголошення", async () => {
      req.user = { userId: "user-123" } as any;
      req.params = { id: "property-123" };

      vi.mocked(propertyService.getPropertyByIdWithoutOwner).mockResolvedValue({
        _id: "property-123",
        owner: "user-123",
      } as any);

      vi.mocked(propertyService.deleteProperty).mockResolvedValue(true as any);

      await deleteProperty(req as any, res as any, next);

      expect(propertyService.deleteProperty).toHaveBeenCalledWith(
        "property-123",
        "user-123",
      );

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Property deleted successfully",
      });

      expect(next).not.toHaveBeenCalled();
    });

    it("повертає 404, якщо оголошення не вдалося видалити", async () => {
      req.user = { userId: "user-123" } as any;
      req.params = { id: "property-123" };

      vi.mocked(propertyService.getPropertyByIdWithoutOwner).mockResolvedValue({
        _id: "property-123",
        owner: "user-123",
      } as any);

      vi.mocked(propertyService.deleteProperty).mockResolvedValue(false as any);

      await deleteProperty(req as any, res as any, next);

      expect(propertyService.deleteProperty).toHaveBeenCalledWith(
        "property-123",
        "user-123",
      );

      expect(res.status).toHaveBeenCalledWith(404);

      expect(res.json).toHaveBeenCalledWith({
        message: "Property not found",
      });

      expect(next).not.toHaveBeenCalled();
    });
  });
});
