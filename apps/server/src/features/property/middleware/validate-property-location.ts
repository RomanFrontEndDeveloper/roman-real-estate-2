import { Request, Response, NextFunction } from "express";

export const validatePropertyLocation = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const location =
    typeof req.body.location === "string" ? req.body.location.trim() : "";

  if (!location) {
    res.status(400).json({
      message: "Location is required",
    });

    return;
  }

  const parts = location
    .split(",")
    .map((part: string) => part.trim())
    .filter(Boolean);

  if (parts.length < 3) {
    res.status(400).json({
      message: "Location must contain city, street and house number",
    });

    return;
  }

  const [city, street, houseNumber] = parts;

  if (!city || !street || !houseNumber) {
    res.status(400).json({
      message: "City, street and house number are required",
    });

    return;
  }

  next();
};
