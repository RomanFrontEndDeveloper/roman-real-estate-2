import type { NextFunction, Request, Response } from "express";

import * as adminService from "../services/admin.service.js";

export const deletePropertyByAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const property = await adminService.deletePropertyByAdmin(id as string);

    if (!property) {
      res.status(404).json({
        message: "Property not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Property deleted successfully by admin",
    });
  } catch (error) {
    next(error);
  }
};
