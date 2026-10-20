import { describe, expect, it } from "vitest";

import { updatePropertySchema } from "./update-property.schema.js";

const validProperty = {
  title: "Modern apartment",
  description: "A comfortable apartment",
  price: 120000,
  currency: "USD",
  listingType: "sale",
  location: "Khmelnytskyi",
  propertyType: "apartment",
  bedrooms: 2,
  kitchenArea: 12,
  area: 65,
};

describe("updatePropertySchema", () => {
  it("приймає валідні дані для оновлення", () => {
    const result = updatePropertySchema.safeParse(validProperty);

    expect(result.success).toBe(true);
  });

  it("дозволяє не передавати remainingImages", () => {
    const result = updatePropertySchema.safeParse(validProperty);

    expect(result.success).toBe(true);
  });

  it("приймає remainingImages у форматі рядка", () => {
    const result = updatePropertySchema.safeParse({
      ...validProperty,
      remainingImages: '["image1.jpg", "image2.jpg"]',
    });

    expect(result.success).toBe(true);
  });

  it("відхиляє від'ємну ціну", () => {
    const result = updatePropertySchema.safeParse({
      ...validProperty,
      price: -100,
    });

    expect(result.success).toBe(false);
  });

  it("відхиляє невідомий тип оголошення", () => {
    const result = updatePropertySchema.safeParse({
      ...validProperty,
      listingType: "exchange",
    });

    expect(result.success).toBe(false);
  });

  it("відхиляє площу, яка не більша за площу кухні", () => {
    const result = updatePropertySchema.safeParse({
      ...validProperty,
      area: 10,
      kitchenArea: 12,
    });

    expect(result.success).toBe(false);
  });

  it("відхиляє оновлення лише одного поля", () => {
    const result = updatePropertySchema.safeParse({
      price: 150000,
    });

    expect(result.success).toBe(false);
  });
});
