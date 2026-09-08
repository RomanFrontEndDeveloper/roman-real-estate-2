import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),

  phone: z.string().trim().optional(),

  bio: z.string().trim().optional(),

  removeAvatar: z.boolean().optional(),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
