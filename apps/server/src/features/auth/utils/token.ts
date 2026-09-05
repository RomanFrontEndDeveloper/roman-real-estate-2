import jwt from "jsonwebtoken";

export type AuthRole =
  | "admin"
  | "agency"
  | "agent"
  | "owner-client";

export type AccessTokenPayload = {
  sub: string;
  role: AuthRole;
};

type RefreshTokenPayload = {
  sub: string;
};

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET is not defined");
}

if (!JWT_REFRESH_SECRET) {
  throw new Error("JWT_REFRESH_SECRET is not defined");
}

export const createAccessToken = (
  payload: AccessTokenPayload,
): string => {
  return jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

export const createRefreshToken = (
  payload: RefreshTokenPayload,
): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyAccessToken = (
  token: string,
): AccessTokenPayload => {
  const decoded = jwt.verify(
    token,
    JWT_ACCESS_SECRET,
  );

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    typeof decoded.sub !== "string" ||
    !isAuthRole(decoded.role)
  ) {
    throw new Error("Invalid access token");
  }

  return {
    sub: decoded.sub,
    role: decoded.role,
  };
};

export const verifyRefreshToken = (
  token: string,
): RefreshTokenPayload => {
  return jwt.verify(
    token,
    JWT_REFRESH_SECRET,
  ) as RefreshTokenPayload;
};

const isAuthRole = (
  role: unknown,
): role is AuthRole => {
  return (
    role === "admin" ||
    role === "agency" ||
    role === "agent" ||
    role === "owner-client"
  );
};