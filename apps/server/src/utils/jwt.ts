import jwt from "jsonwebtoken";
import { UserRole } from "../generated/prisma/enums";

export interface JwtPayload {
  userId: number;
  role: UserRole;
}

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as NonNullable<jwt.SignOptions["expiresIn"]>,
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
