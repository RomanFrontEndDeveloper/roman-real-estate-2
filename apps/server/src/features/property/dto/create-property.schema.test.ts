import { describe, expect, it } from "vitest";

import { createPropertySchema } from "./create-property.schema.js";

const validProperty = {
  title: "Modern apartment",
  description: "A comfortable apartment in the city center",
  price: 120000,
  currency: "USD",
  listingType: "sale",
  location: "Khmelnytskyi",
  propertyType: "apartment",
  bedrooms: 2,
  kitchenArea: 12,
  area: 65,
};

describe("createPropertySchema", () => {
  it("приймає валідні дані оголошення", () => {
    const result = createPropertySchema.safeParse(validProperty);

    expect(result.success).toBe(true);
  });

  it("відхиляє порожній заголовок", () => {
    const result = createPropertySchema.safeParse({
      ...validProperty,
      title: "   ",
    });

    expect(result.success).toBe(false);
  });

  it("відхиляє ціну, яка дорівнює нулю", () => {
    const result = createPropertySchema.safeParse({
      ...validProperty,
      price: 0,
    });

    expect(result.success).toBe(false);
  });

  it("відхиляє кількість спалень, яка не є цілим числом", () => {
    const result = createPropertySchema.safeParse({
      ...validProperty,
      bedrooms: 2.5,
    });

    expect(result.success).toBe(false);
  });

  it("відхиляє невідому валюту", () => {
    const result = createPropertySchema.safeParse({
      ...validProperty,
      currency: "EUR",
    });

    expect(result.success).toBe(false);
  });

  it("відхиляє площу, яка не більша за площу кухні", () => {
    const result = createPropertySchema.safeParse({
      ...validProperty,
      area: 12,
      kitchenArea: 12,
    });

    expect(result.success).toBe(false);
  });
});
