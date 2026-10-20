import type { AuthRole } from "../features/auth/utils/token.js";

declare module "socket.io" {
  interface SocketData {
    user: {
      userId: string;
      role: AuthRole; // type AuthRole = "admin" | "agency" | "agent" | "owner-client";
    };
  }
}
