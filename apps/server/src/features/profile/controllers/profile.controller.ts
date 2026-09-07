import type { Request, Response } from "express";
import { updateProfileSchema } from "../dto/update-profile.schema.js";
import { changeEmailSchema } from "../dto/change-email.schema.js";
import { changePasswordSchema } from "../dto/change-password.schema.js";

import {
  changeUserEmail,
  changeUserPassword,
  updateProfile,
  updateProfileAvatar,
} from "../services/profile.service.js";

export const updateAvatar = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });

      return;
    }

    if (!req.file) {
      res.status(400).json({
        message: "Avatar file is required",
      });

      return;
    }

    const user = await updateProfileAvatar(req.user.userId, req.file);

    res.status(200).json({
      message: "Avatar updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    const statusCode =
      error instanceof Error &&
      "statusCode" in error &&
      typeof error.statusCode === "number"
        ? error.statusCode
        : 500;

    console.error("Avatar update error:", error);

    res.status(statusCode).json({
      message:
        statusCode === 500
          ? "Internal server error"
          : error instanceof Error
            ? error.message
            : "Avatar update failed",
    });
  }
};

export const changeEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });

      return;
    }

    const result = changeEmailSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });

      return;
    }

    const user = await changeUserEmail(req.user.userId, result.data.email);

    res.status(200).json({
      message: "Email updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    const statusCode =
      error instanceof Error &&
      "statusCode" in error &&
      typeof error.statusCode === "number"
        ? error.statusCode
        : 500;

    console.error("Change email error:", error);

    res.status(statusCode).json({
      message:
        statusCode === 500
          ? "Internal server error"
          : error instanceof Error
            ? error.message
            : "Failed to update email",
    });
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });

      return;
    }

    const result = changePasswordSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });

      return;
    }

    await changeUserPassword(
      req.user.userId,
      result.data.currentPassword,
      result.data.newPassword,
    );

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    const statusCode =
      error instanceof Error &&
      "statusCode" in error &&
      typeof error.statusCode === "number"
        ? error.statusCode
        : 500;

    console.error("Change password error:", error);

    res.status(statusCode).json({
      message:
        statusCode === 500
          ? "Internal server error"
          : error instanceof Error
            ? error.message
            : "Failed to update password",
    });
  }
};

export const updateProfileData = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const result = updateProfileSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    const user = await updateProfile(req.user.userId, result.data);

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        bio: user.bio,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    const statusCode =
      (error as Error & { statusCode?: number }).statusCode ?? 500;

    res.status(statusCode).json({
      message:
        error instanceof Error ? error.message : "Failed to update profile",
    });
  }
};
