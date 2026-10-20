import type { Socket } from "socket.io";

import User from "../features/auth/models/User.js";
import { verifyAccessToken } from "../features/auth/utils/token.js";

export const authenticateSocket = async (
  socket: Socket,
  next: (err?: Error) => void,
): Promise<void> => {
  try {
    const token = socket.handshake.auth?.token;

    if (typeof token !== "string" || !token) {
      return next(new Error("Authentication required"));
    }

    const payload = verifyAccessToken(token);

    const user = await User.findById(payload.sub).select("_id role isBlocked");

    if (!user) {
      return next(new Error("User not found"));
    }

    if (user.isBlocked === true) {
      return next(new Error("Your account has been blocked"));
    }

    socket.data.user = {
      userId: user._id.toString(),
      role: user.role,
    };

    next();
  } catch {
    next(new Error("Invalid or expired access token"));
  }
};
