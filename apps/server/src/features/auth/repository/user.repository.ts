import User from "../models/User.js";

export const findUserByEmail = async (email: string) => {
  return User.findOne({ email });
};

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: "agency" | "agent" | "owner-client";
}) => {
  return User.create(data);
};