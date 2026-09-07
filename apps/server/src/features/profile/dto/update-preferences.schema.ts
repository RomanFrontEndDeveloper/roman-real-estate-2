import { z } from "zod";

export const updatePreferencesSchema = z.object({
  emailNotifications: z.boolean(),

  propertyAlerts: z.boolean(),
});

export type UpdatePreferencesDto = z.infer<typeof updatePreferencesSchema>;
