import type { RegisterDto } from "../dto/register.schema.js";

import { createUser, findUserByEmail } from "../repository/user.repository.js";

export const registerUser = async (data: RegisterDto) => {
  const normalizedEmail = data.email.trim().toLowerCase();
  const normalizedName = data.name.trim();

  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    const error = new Error("User with this email already exists");

    (error as Error & { statusCode?: number }).statusCode = 409;

    throw error;
  }

  const user = await createUser({
    name: normalizedName,
    email: normalizedEmail,
    password: data.password,
    role: data.role,
  });

  return user;
};
