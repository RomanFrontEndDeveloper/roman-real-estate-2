import { z } from "zod";

export const changeEmailSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

export type ChangeEmailFormValues = z.infer<typeof changeEmailSchema>;
