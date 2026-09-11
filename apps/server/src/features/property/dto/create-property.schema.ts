import { z } from "zod";

export const createPropertySchema = z
  .object({
    title: z.string().trim().min(1, "Title is required"),

    description: z.string().trim().min(1, "Description is required"),

    price: z.coerce.number().positive("Price must be greater than 0"),

    currency: z.enum(["UAH", "USD"]),

    listingType: z.enum(["sale", "rent"]),

    location: z.string().trim().min(1, "Location is required"),

    propertyType: z.string().trim().min(1, "Property type is required"),

    bedrooms: z.coerce
      .number()
      .int("Bedrooms must be an integer")
      .min(1, "Bedrooms must be at least 1"),

    kitchenArea: z.coerce
      .number()
      .positive("Kitchen area must be greater than 0"),

    area: z.coerce.number().positive("Area must be greater than 0"),
  })
  .refine((data) => data.area > data.kitchenArea, {
    message: "Area must be greater than kitchen area",
    path: ["area"],
  });
