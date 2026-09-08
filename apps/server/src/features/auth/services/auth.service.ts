import bcrypt from "bcryptjs";
import type { LoginDto } from "../dto/login.schema.js";
import type { RegisterDto } from "../dto/register.schema.js";
import { ApiError } from "../utils/api-error.js";

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
    throw new ApiError("User with this email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

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
