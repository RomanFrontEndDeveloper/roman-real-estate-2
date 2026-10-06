import type { NextFunction, Request, Response } from "express";

import { updatePropertySchema } from "./update-property.schema.js";

export const validateUpdateProperty = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const result = updatePropertySchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });

    return;
  }

  req.body = result.data;

  next();
};
