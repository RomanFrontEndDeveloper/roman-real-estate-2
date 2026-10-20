import { beforeEach, describe, expect, it, vi } from "vitest";
import { Types } from "mongoose";

const { repository, geocodeLocationMock } = vi.hoisted(() => ({
  repository: {
    createProperty: vi.fn(),
    findProperties: vi.fn(),
    countProperties: vi.fn(),
    findPropertiesByOwner: vi.fn(),
    findPropertyById: vi.fn(),
    updateProperty: vi.fn(),
    deleteProperty: vi.fn(),
    findPropertyByIdWithoutOwner: vi.fn(),
  },
  geocodeLocationMock: vi.fn(),
}));

vi.mock("../repository/property.repository.js", () => repository);

vi.mock("../utils/geocode-location.js", () => ({
  geocodeLocation: geocodeLocationMock,
}));

import {
  createProperty,
  getProperties,
  countProperties,
  getMyProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getPropertyByIdWithoutOwner,
} from "./property.service.js";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("property.service", () => {
  describe("createProperty", () => {
    it("геокодує адресу та передає координати в репозиторій", async () => {
      const owner = new Types.ObjectId();

      const data = {
        title: "Квартира в центрі",
        description: "Світла квартира",
        price: 100_000,
        location: "Хмельницький",
        owner,
      } as Parameters<typeof createProperty>[0];

      geocodeLocationMock.mockResolvedValue({
        latitude: 49.42,
        longitude: 26.98,
      });

      repository.createProperty.mockResolvedValue({
        ...data,
        latitude: 49.42,
        longitude: 26.98,
      });

      await createProperty(data);

      expect(geocodeLocationMock).toHaveBeenCalledWith("Хмельницький");

      expect(repository.createProperty).toHaveBeenCalledWith({
        ...data,
        latitude: 49.42,
        longitude: 26.98,
      });
    });

    it("не створює оголошення, якщо геокодування завершилося помилкою", async () => {
      geocodeLocationMock.mockRejectedValue(new Error("Geocoding failed"));

      const data = {
        location: "Невідома адреса",
        owner: new Types.ObjectId(),
      } as Parameters<typeof createProperty>[0];

      await expect(createProperty(data)).rejects.toThrow("Geocoding failed");

      expect(repository.createProperty).not.toHaveBeenCalled();
    });
  });

  describe("getProperties", () => {
    it("передає фільтри, сортування та пагінацію в репозиторій", async () => {
      const filters = { listingType: "sale" };
      const sort = { price: 1 } as Record<string, 1 | -1>;

      repository.findProperties.mockResolvedValue([]);

      await getProperties(filters, sort, 6, 12);

      expect(repository.findProperties).toHaveBeenCalledWith(
        filters,
        sort,
        6,
        12,
      );
    });

    it("використовує стандартні параметри пагінації", async () => {
      repository.findProperties.mockResolvedValue([]);

      await getProperties({});

      expect(repository.findProperties).toHaveBeenCalledWith({}, {}, 0, 6);
    });
  });

  describe("countProperties", () => {
    it("повертає кількість оголошень за фільтрами", async () => {
      repository.countProperties.mockResolvedValue(5);

      await expect(countProperties({ listingType: "sale" })).resolves.toBe(5);
    });
  });

  describe("getMyProperties", () => {
    it("запитує оголошення конкретного користувача", async () => {
      repository.findPropertiesByOwner.mockResolvedValue([]);

      await getMyProperties("user-123");

      expect(repository.findPropertiesByOwner).toHaveBeenCalledWith("user-123");
    });
  });

  describe("getPropertyById", () => {
    it("повертає знайдене оголошення", async () => {
      const property = { _id: "property-123", title: "Квартира" };

      repository.findPropertyById.mockResolvedValue(property);

      await expect(getPropertyById("property-123")).resolves.toEqual(property);
    });

    it("викидає ApiError зі статусом 404, якщо оголошення відсутнє", async () => {
      repository.findPropertyById.mockResolvedValue(null);

      const error = await getPropertyById("missing-id").catch(
        (caught: unknown) => caught as { message: string; statusCode: number },
      );

      expect(error).toMatchObject({
        message: "Property not found",
        statusCode: 404,
      });
    });
  });

  describe("updateProperty", () => {
    it("оновлює координати, якщо адресу змінено", async () => {
      geocodeLocationMock.mockResolvedValue({
        latitude: 49.42,
        longitude: 26.98,
      });
      repository.updateProperty.mockResolvedValue({ _id: "property-123" });

      const data = { location: "  Хмельницький  " };

      await updateProperty("property-123", "user-123", data);

      expect(geocodeLocationMock).toHaveBeenCalledWith("Хмельницький");

      expect(repository.updateProperty).toHaveBeenCalledWith(
        "property-123",
        "user-123",
        {
          location: "  Хмельницький  ",
          latitude: 49.42,
          longitude: 26.98,
        },
      );
    });

    it("не викликає геокодування, якщо адресу не передано", async () => {
      repository.updateProperty.mockResolvedValue({ _id: "property-123" });

      const data = { price: 120_000 } as Parameters<typeof updateProperty>[2];

      await updateProperty("property-123", "user-123", data);

      expect(geocodeLocationMock).not.toHaveBeenCalled();
      expect(repository.updateProperty).toHaveBeenCalledWith(
        "property-123",
        "user-123",
        data,
      );
    });
  });

  describe("deleteProperty", () => {
    it("передає ID оголошення та власника в репозиторій", async () => {
      repository.deleteProperty.mockResolvedValue({ deleted: true });

      await deleteProperty("property-123", "user-123");

      expect(repository.deleteProperty).toHaveBeenCalledWith(
        "property-123",
        "user-123",
      );
    });
  });

  describe("getPropertyByIdWithoutOwner", () => {
    it("викидає помилку 404, якщо оголошення не знайдено", async () => {
      repository.findPropertyByIdWithoutOwner.mockResolvedValue(null);

      const error = await getPropertyByIdWithoutOwner("missing-id").catch(
        (caught: unknown) => caught as { message: string; statusCode: number },
      );

      expect(error).toMatchObject({
        message: "Property not found",
        statusCode: 404,
      });
    });
  });
});
