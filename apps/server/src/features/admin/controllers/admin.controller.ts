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

export const getUsersForAdmin = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const users = await adminService.getUsersForAdmin();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserBlockStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    if (typeof isBlocked !== "boolean") {
      res.status(400).json({
        message: "isBlocked must be a boolean",
      });
      return;
    }

    const user = await adminService.updateUserBlockStatus(
      id as string,
      isBlocked,
    );

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
