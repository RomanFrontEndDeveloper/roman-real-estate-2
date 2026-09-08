import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "admin" | "agency" | "agent" | "owner-client";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  bio?: string;
  avatar?: {
    url: string;
    publicId: string;
  };

  isVerified: boolean;
  verificationTokenHash?: string;
  verificationTokenExpires?: Date;

  resetPasswordTokenHash?: string;
  resetPasswordTokenExpires?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "agency", "agent", "owner-client"],
      default: "owner-client",
      required: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    bio: {
      type: String,
      trim: true,
    },

    avatar: {
      url: {
        type: String,
        trim: true,
      },
      publicId: {
        type: String,
        trim: true,
      },
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationTokenHash: {
      type: String,
    },

    verificationTokenExpires: {
      type: Date,
    },

    resetPasswordTokenHash: {
      type: String,
    },

    resetPasswordTokenExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
