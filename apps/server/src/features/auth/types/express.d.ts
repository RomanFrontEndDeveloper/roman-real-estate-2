import type { AuthRole } from "../utils/token.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: AuthRole;
      };
    }
  }
}

export {};
