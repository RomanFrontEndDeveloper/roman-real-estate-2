import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),

  phone: z
    .string()
    .trim()
    .max(30, "Phone must be at most 30 characters")
    .optional()
    .or(z.literal("")),

  bio: z
    .string()
    .trim()
    .max(500, "Bio must be at most 500 characters")
    .optional()
    .or(z.literal("")),
});

export type ProfileFormValues = z.infer<
  typeof profileSchema
>;