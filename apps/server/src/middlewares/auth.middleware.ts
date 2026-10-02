import { type Request, type Response, type NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Akses ditolak. Token tidak disediakan." });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Format token tidak valid." });
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    res
      .status(401)
      .json({ message: "Token tidak valid atau telah kedaluwarsa." });
  }
};

export { authenticate };
