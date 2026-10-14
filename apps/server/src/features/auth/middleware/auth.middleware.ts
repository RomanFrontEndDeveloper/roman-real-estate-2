import type { NextFunction, Request, Response } from "express";

import User from "../models/User.js";
import { verifyAccessToken } from "../utils/token.js";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({
      message: "Invalid authorization header",
    });
    return;
  }

  try {
    const payload = verifyAccessToken(token);

    const user = await User.findById(payload.sub).select("_id role isBlocked");

    if (!user) {
      res.status(401).json({
        message: "User not found",
      });
      return;
    }

    if (user.isBlocked === true) {
      res.status(403).json({
        message: "Your account has been blocked",
      });
      return;
    }

    req.user = {
      userId: user._id.toString(),
      role: user.role,
    };

    next();
  } catch (error) {
    // Не перетворюємо помилки бази даних на помилку токена.
    next(error);
  }
};
