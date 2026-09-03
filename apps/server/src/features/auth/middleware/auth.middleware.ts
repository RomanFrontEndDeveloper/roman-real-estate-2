import type { NextFunction, Request, Response } from "express";

import { verifyAccessToken } from "../utils/token.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
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

    req.user = {
      userId: payload.sub,
      role: payload.role,
    };

    next();
  } catch {
    res.status(401).json({
      message: "Invalid or expired access token",
    });
  }
};
