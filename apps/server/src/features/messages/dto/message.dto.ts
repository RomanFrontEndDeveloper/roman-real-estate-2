import { z } from "zod";

export const sendMessageSchema = z
  .object({
    recipientId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid recipient ID"),
    text: z
      .string()
      .trim()
      .min(1, "Message cannot be empty")
      .max(5000, "Message cannot exceed 5000 characters"),
  })
  .strict();

export const conversationParamsSchema = z
  .object({
    userId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid user ID"),
  })
  .strict();

export type SendMessageDto = z.infer<typeof sendMessageSchema>;
