import { z } from "zod";

export const changeEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((value) => value.toLowerCase()),
});

export type ChangeEmailDto = z.infer<typeof changeEmailSchema>;
