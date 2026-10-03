import jwt from "jsonwebtoken";
import { UserRole } from "../generated/prisma/enums";

interface JwtPayload {
  userId: number;
  role: UserRole;
}

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as NonNullable<jwt.SignOptions["expiresIn"]>,
  });
};

const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export type { JwtPayload };
export { generateToken, verifyToken };
