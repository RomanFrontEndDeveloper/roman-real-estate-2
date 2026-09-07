import { z } from "zod";

export const preferencesSchema = z.object({
  emailNotifications: z.boolean(),

  propertyAlerts: z.boolean(),
});

export type PreferencesFormValues = z.infer<
  typeof preferencesSchema
>;