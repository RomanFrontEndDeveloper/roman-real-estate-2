import crypto from "node:crypto";
import bcrypt from "bcryptjs";

import type { LoginDto } from "../dto/login.schema.js";
import type { RegisterDto } from "../dto/register.schema.js";
import type { ForgotPasswordDto } from "../dto/forgot-password.schema.js";
import type { ResetPasswordDto } from "../dto/reset-password.schema.js";

import { ApiError } from "../utils/api-error.js";

import {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByResetPasswordTokenHash,
  resetUserPassword,
  setResetPasswordToken,
} from "../repository/user.repository.js";

import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../utils/token.js";

import { sendResetPasswordEmail } from "./mail.service.js";

const SALT_ROUNDS = 12;

const RESET_PASSWORD_TOKEN_EXPIRES_IN = 60 * 60 * 1000; // 1 hour

export const registerUser = async (data: RegisterDto) => {
  const normalizedEmail = data.email.trim().toLowerCase();
  const normalizedName = data.name.trim();

  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new ApiError("User with this email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await createUser({
    name: normalizedName,
    email: normalizedEmail,
    password: hashedPassword,
    role: data.role,
    isVerified: true,
  });

  return user;
};

export const loginUser = async (data: LoginDto) => {
  const normalizedEmail = data.email.trim().toLowerCase();

  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    throw new ApiError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new ApiError("Invalid email or password", 401);
  }

  const accessToken = createAccessToken({
    sub: user._id.toString(),
    role: user.role,
  });

  const refreshToken = createRefreshToken({
    sub: user._id.toString(),
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const payload = verifyRefreshToken(refreshToken);

    const user = await findUserById(payload.sub);

    if (!user) {
      throw new ApiError("Invalid refresh token", 401);
    }

    const accessToken = createAccessToken({
      sub: user._id.toString(),
      role: user.role,
    });

    return accessToken;
  } catch {
    throw new ApiError("Invalid refresh token", 401);
  }
};

export const forgotPassword = async (data: ForgotPasswordDto) => {
  const normalizedEmail = data.email.trim().toLowerCase();

  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    return;
  }

  const resetPasswordToken = crypto.randomBytes(32).toString("hex");

  const resetPasswordTokenHash = crypto
    .createHash("sha256")
    .update(resetPasswordToken)
    .digest("hex");

  const resetPasswordTokenExpires = new Date(
    Date.now() + RESET_PASSWORD_TOKEN_EXPIRES_IN,
  );

  await setResetPasswordToken(
    user._id.toString(),
    resetPasswordTokenHash,
    resetPasswordTokenExpires,
  );

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetPasswordToken}`;

  await sendResetPasswordEmail(normalizedEmail, resetPasswordUrl);
};

export const resetPassword = async (data: ResetPasswordDto) => {
  const resetPasswordTokenHash = crypto
    .createHash("sha256")
    .update(data.token)
    .digest("hex");

  const user = await findUserByResetPasswordTokenHash(resetPasswordTokenHash);

  if (!user) {
    throw new ApiError("Invalid reset password token", 400);
  }

  if (
    !user.resetPasswordTokenExpires ||
    user.resetPasswordTokenExpires.getTime() < Date.now()
  ) {
    throw new ApiError("Reset password token has expired", 400);
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const updatedUser = await resetUserPassword(
    user._id.toString(),
    hashedPassword,
  );

  if (!updatedUser) {
    throw new ApiError("Unable to reset password", 500);
  }

  return updatedUser;
};
