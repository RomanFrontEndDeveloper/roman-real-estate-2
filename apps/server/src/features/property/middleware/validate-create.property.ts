import type { NextFunction, Request, Response } from "express";

import { createPropertySchema } from "../dto/create-property.schema.js";

export const validateCreateProperty = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const result = createPropertySchema.safeParse(req.body);

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
