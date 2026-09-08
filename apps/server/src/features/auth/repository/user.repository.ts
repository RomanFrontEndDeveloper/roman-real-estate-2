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
  verificationTokenHash?: string;
  verificationTokenExpires?: Date;
}) => {
  return User.create(data);
};

export const findUserById = async (id: string) => {
  return User.findById(id);
};

export const findUserByVerificationTokenHash = async (
  verificationTokenHash: string,
) => {
  return User.findOne({
    verificationTokenHash,
  });
};

export const verifyUser = async (userId: string) => {
  return User.findByIdAndUpdate(
    userId,
    {
      $set: {
        isVerified: true,
      },
      $unset: {
        verificationTokenHash: 1,
        verificationTokenExpires: 1,
      },
    },
    {
      new: true,
    },
  );
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
