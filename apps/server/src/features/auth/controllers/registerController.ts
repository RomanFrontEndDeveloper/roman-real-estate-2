import type { Request, Response } from "express";
import { loginSchema } from "../dto/login.schema.js";
import { registerSchema } from "../dto/register.schema.js";
import { forgotPasswordSchema } from "../dto/forgot-password.schema.js";
import { resetPasswordSchema } from "../dto/reset-password.schema.js";

import {
  forgotPassword,
  loginUser,
  refreshAccessToken,
  registerUser,
  resetPassword,
  verifyEmail,
} from "../services/auth.service.js";

import { findUserById } from "../repository/user.repository.js";
import { formatValidationErrors } from "../utils/validation.js";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: formatValidationErrors(result.error),
      });

      return;
    }

    const user = await registerUser(result.data);

    res.status(200).json({
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
      error instanceof Error &&
      "statusCode" in error &&
      typeof error.statusCode === "number"
        ? error.statusCode
        : 500;

    console.error("Register error:", error);

    res.status(statusCode).json({
      message:
        statusCode === 500
          ? "Internal server error"
          : error instanceof Error
            ? error.message
            : "Registration failed",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: formatValidationErrors(result.error),
      });

      return;
    }

    const { user, accessToken, refreshToken } = await loginUser(result.data);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth",
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
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

    console.error("Login error:", error);

    res.status(statusCode).json({
      message:
        statusCode === 500
          ? "Internal server error"
          : error instanceof Error
            ? error.message
            : "Login failed",
    });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({
        message: "Refresh token is missing",
      });

      return;
    }

    const accessToken = await refreshAccessToken(refreshToken);

    res.status(200).json({
      message: "Access token refreshed",
      accessToken,
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

export const getCurrentUser = async (
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

    const user = await findUserById(req.user.userId);

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });

      return;
    }

    res.status(200).json({
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
    console.error("Get current user error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/api/auth",
  });

  res.status(200).json({
    message: "Logout successful",
  });
};

export const verifyEmailController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { token } = req.query;

    if (typeof token !== "string" || !token) {
      res.status(400).json({
        message: "Verification token is required",
      });
      return;
    }

    await verifyEmail(token);

    res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    const statusCode =
      error instanceof Error &&
      "statusCode" in error &&
      typeof error.statusCode === "number"
        ? error.statusCode
        : 500;

    console.error("Verify email error:", error);

    res.status(statusCode).json({
      message:
        statusCode === 500
          ? "Internal server error"
          : error instanceof Error
            ? error.message
            : "Email verification failed",
    });
  }
};

export const forgotPasswordController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = forgotPasswordSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: formatValidationErrors(result.error),
      });
      return;
    }

    await forgotPassword(result.data);

    res.status(200).json({
      message:
        "If an account with this email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    res.status(500).json({
      message: "Unable to send password reset email",
    });
  }
};

export const resetPasswordController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = resetPasswordSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: formatValidationErrors(result.error),
      });
      return;
    }

    await resetPassword(result.data);

    res.status(200).json({
      message: "Password has been reset successfully",
    });
  } catch (error) {
    const statusCode =
      error instanceof Error &&
      "statusCode" in error &&
      typeof error.statusCode === "number"
        ? error.statusCode
        : 500;

    console.error("Reset password error:", error);

    res.status(statusCode).json({
      message:
        statusCode === 500
          ? "Unable to reset password"
          : error instanceof Error
            ? error.message
            : "Unable to reset password",
    });
  }
};
