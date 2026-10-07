import User from "../models/User.js";

export const findUserByEmail = async (email: string) => {
  return User.findOne({ email });
};

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: "agency" | "agent" | "owner-client";
  isVerified: boolean;
}) => {
  return User.create(data);
};

export const findUserById = async (id: string) => {
  return User.findById(id);
};

export const findUserByResetPasswordTokenHash = async (
  resetPasswordTokenHash: string,
) => {
  return User.findOne({
    resetPasswordTokenHash,
  });
};

export const setResetPasswordToken = async (
  userId: string,
  resetPasswordTokenHash: string,
  resetPasswordTokenExpires: Date,
) => {
  return User.findByIdAndUpdate(
    userId,
    {
      $set: {
        resetPasswordTokenHash,
        resetPasswordTokenExpires,
      },
    },
    {
      new: true,
    },
  );
};

export const resetUserPassword = async (userId: string, password: string) => {
  return User.findByIdAndUpdate(
    userId,
    {
      $set: {
        password,
      },
      $unset: {
        resetPasswordTokenHash: 1,
        resetPasswordTokenExpires: 1,
      },
    },
    {
      new: true,
    },
  );
};
