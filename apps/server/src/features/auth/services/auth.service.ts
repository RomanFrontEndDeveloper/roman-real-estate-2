import crypto from "node:crypto";
import bcrypt from "bcryptjs";

import type { LoginDto } from "../dto/login.schema.js";
import type { RegisterDto } from "../dto/register.schema.js";

import { ApiError } from "../utils/api-error.js";

import {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByVerificationTokenHash,
  verifyUser,
} from "../repository/user.repository.js";

import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../utils/token.js";

import { sendVerificationEmail } from "./mail.service.js";

const SALT_ROUNDS = 12;

const VERIFICATION_TOKEN_EXPIRES_IN = 60 * 60 * 1000; // 1 hour

export const registerUser = async (data: RegisterDto) => {
  const normalizedEmail = data.email.trim().toLowerCase();
  const normalizedName = data.name.trim();

  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new ApiError("User with this email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const verificationToken = crypto.randomBytes(32).toString("hex");

  const verificationTokenHash = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  const verificationTokenExpires = new Date(
    Date.now() + VERIFICATION_TOKEN_EXPIRES_IN,
  );

  const user = await createUser({
    name: normalizedName,
    email: normalizedEmail,
    password: hashedPassword,
    role: data.role,
    isVerified: false,
    verificationTokenHash,
    verificationTokenExpires,
  });

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  await sendVerificationEmail(normalizedEmail, verificationUrl);

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

  if (!user.isVerified) {
    throw new ApiError("Please verify your email before logging in", 403);
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

export const verifyEmail = async (token: string) => {
  const verificationTokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await findUserByVerificationTokenHash(
    verificationTokenHash,
  );

  if (!user) {
    throw new ApiError("Invalid verification token", 400);
  }

  if (
    !user.verificationTokenExpires ||
    user.verificationTokenExpires.getTime() < Date.now()
  ) {
    throw new ApiError("Verification token has expired", 400);
  }

  if (user.isVerified) {
    throw new ApiError("Email is already verified", 400);
  }

  const verifiedUser = await verifyUser(user._id.toString());

  if (!verifiedUser) {
    throw new ApiError("Unable to verify email", 500);
  }

  return verifiedUser;
};
