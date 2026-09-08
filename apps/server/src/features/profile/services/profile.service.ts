import { uploadAvatar } from "../utils/upload-avatar.js";

import cloudinary from "../utils/cloudinary.js";

import bcrypt from "bcryptjs";

import {
  findUserById,
  findUserByEmail,
} from "../../auth/repository/user.repository.js";

import {
  updateUserEmail,
  updateUserPassword,
  updateUserAvatar,
  removeUserAvatar,
  updateUserProfile,
} from "../repository/user.repository.js";

export const updateProfileAvatar = async (
  userId: string,
  file: Express.Multer.File,
) => {
  const user = await findUserById(userId);

  if (!user) {
    const error = new Error("User not found");

    (error as Error & { statusCode?: number }).statusCode = 404;

    throw error;
  }

  const oldPublicId = user.avatar?.publicId;

  const avatar = await uploadAvatar(file.buffer);

  const updatedUser = await updateUserAvatar(userId, avatar);

  if (!updatedUser) {
    const error = new Error("Failed to update user avatar");

    (error as Error & { statusCode?: number }).statusCode = 500;

    throw error;
  }

  if (oldPublicId) {
    await cloudinary.uploader.destroy(oldPublicId);
  }

  return updatedUser;
};

export const changeUserEmail = async (userId: string, email: string) => {
  const user = await findUserById(userId);

  if (!user) {
    const error = new Error("User not found");

    (error as Error & { statusCode?: number }).statusCode = 404;

    throw error;
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser && existingUser._id.toString() !== userId) {
    const error = new Error("User with this email already exists");

    (error as Error & { statusCode?: number }).statusCode = 409;

    throw error;
  }

  const updatedUser = await updateUserEmail(userId, email);

  if (!updatedUser) {
    const error = new Error("Failed to update email");

    (error as Error & { statusCode?: number }).statusCode = 500;

    throw error;
  }

  return updatedUser;
};

export const changeUserPassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
) => {
  const user = await findUserById(userId);

  if (!user) {
    const error = new Error("User not found");

    (error as Error & { statusCode?: number }).statusCode = 404;

    throw error;
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isCurrentPasswordValid) {
    const error = new Error("Current password is incorrect");

    (error as Error & { statusCode?: number }).statusCode = 401;

    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  const updatedUser = await updateUserPassword(userId, hashedPassword);

  if (!updatedUser) {
    const error = new Error("Failed to update password");

    (error as Error & { statusCode?: number }).statusCode = 500;

    throw error;
  }

  return updatedUser;
};

export const updateProfile = async (
  userId: string,
  data: {
    name: string;
    phone?: string;
    bio?: string;
    removeAvatar?: boolean;
  },
) => {
  const user = await findUserById(userId);

  if (!user) {
    const error = new Error("User not found");

    (error as Error & { statusCode?: number }).statusCode = 404;

    throw error;
  }

  const { name, phone, bio, removeAvatar } = data;

  if (removeAvatar && user.avatar?.publicId) {
    await cloudinary.uploader.destroy(user.avatar.publicId);

    const updatedUser = await removeUserAvatar(userId);

    if (!updatedUser) {
      const error = new Error("Failed to remove user avatar");

      (error as Error & { statusCode?: number }).statusCode = 500;

      throw error;
    }

    const finalUser = await updateUserProfile(userId, {
      name,
      phone,
      bio,
    });

    if (!finalUser) {
      const error = new Error("Failed to update profile");

      (error as Error & { statusCode?: number }).statusCode = 500;

      throw error;
    }

    return finalUser;
  }

  const updatedUser = await updateUserProfile(userId, {
    name,
    phone,
    bio,
  });

  if (!updatedUser) {
    const error = new Error("Failed to update profile");

    (error as Error & { statusCode?: number }).statusCode = 500;

    throw error;
  }

  return updatedUser;
};
