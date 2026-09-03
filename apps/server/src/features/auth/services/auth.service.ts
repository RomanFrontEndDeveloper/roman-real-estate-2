import bcrypt from "bcryptjs";

import type { LoginDto } from "../dto/login.schema.js";
import type { RegisterDto } from "../dto/register.schema.js";

import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../repository/user.repository.js";

import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../utils/token.js";

const SALT_ROUNDS = 12;

export const registerUser = async (data: RegisterDto) => {
  const normalizedEmail = data.email.trim().toLowerCase();
  const normalizedName = data.name.trim();

  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    const error = new Error(
      "User with this email already exists",
    );

    (error as Error & { statusCode?: number }).statusCode = 409;

    throw error;
  }

  const hashedPassword = await bcrypt.hash(
    data.password,
    SALT_ROUNDS,
  );

  const user = await createUser({
    name: normalizedName,
    email: normalizedEmail,
    password: hashedPassword,
    role: data.role,
  });

  return user;
};

export const loginUser = async (data: LoginDto) => {
  const normalizedEmail = data.email.trim().toLowerCase();

  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    const error = new Error(
      "Invalid email or password",
    );

    (error as Error & { statusCode?: number }).statusCode = 401;

    throw error;
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.password,
  );

  if (!isPasswordValid) {
    const error = new Error(
      "Invalid email or password",
    );

    (error as Error & { statusCode?: number }).statusCode = 401;

    throw error;
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

export const refreshAccessToken = async (
  refreshToken: string,
) => {
  try {
    const payload = verifyRefreshToken(refreshToken);

    const user = await findUserById(payload.sub);

    if (!user) {
      const error = new Error(
        "Invalid refresh token",
      );

      (error as Error & { statusCode?: number }).statusCode = 401;

      throw error;
    }

    const accessToken = createAccessToken({
      sub: user._id.toString(),
      role: user.role,
    });

    return accessToken;
  } catch {
    const error = new Error(
      "Invalid refresh token",
    );

    (error as Error & { statusCode?: number }).statusCode = 401;

    throw error;
  }
};