import type { ZodError } from "zod";

export const formatValidationErrors = (
  error: ZodError,
) => {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
};