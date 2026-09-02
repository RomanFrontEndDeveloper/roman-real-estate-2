import type { UserRole } from "../models/User.js";

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role: Exclude<UserRole, "admin">;
}
