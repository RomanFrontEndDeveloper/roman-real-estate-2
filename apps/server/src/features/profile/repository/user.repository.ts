import User from "../../auth/models/User.js";

export const updateUserAvatar = async (
  userId: string,
  avatar: {
    url: string;
    publicId: string;
  },
) => {
  return User.findByIdAndUpdate(
    userId,
    {
      avatar,
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).select("-password");
};

export const updateUserPreferences = async (
  userId: string,
  preferences: {
    emailNotifications: boolean;
    propertyAlerts: boolean;
  },
) => {
  return User.findByIdAndUpdate(
    userId,
    {
      preferences,
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).select("-password");
};

export const updateUserEmail = async (userId: string, email: string) => {
  return User.findByIdAndUpdate(
    userId,
    {
      email,
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).select("-password");
};

export const updateUserPassword = async (userId: string, password: string) => {
  return User.findByIdAndUpdate(
    userId,
    {
      password,
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).select("-password");
};

export const updateUserProfile = async (
  userId: string,
  data: {
    name: string;
    phone?: string;
    bio?: string;
  },
) => {
  return User.findByIdAndUpdate(userId, data, {
    returnDocument: "after",
    runValidators: true,
  }).select("-password");
};
