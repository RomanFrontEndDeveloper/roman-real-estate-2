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
    const payload = verifyAccessToken(token); // це дані, які були записані всередину JWT, коли backend його створював.

    req.user = {
      userId: payload.sub, // це userId, який був записаний всередину JWT, коли backend його створював.
      role: payload.role, // це роль користувача, яка була записана всередину JWT, коли backend його створював.
    };

    next();
  } catch {
    res.status(401).json({
      message: "Invalid or expired access token",
    });
  }
};

//наприклад:
// {
//   sub: "123456",
//   role: "agent",
//   iat: 1756900000,
//   exp: 1756903600
// }
