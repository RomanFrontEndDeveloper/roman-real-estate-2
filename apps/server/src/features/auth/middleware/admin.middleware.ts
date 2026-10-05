import type { NextFunction, Request, Response } from "express";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role !== "admin") {
    res.status(403).json({
      message: "Admin access required",
    });

    return;
  }

  next();
};
