import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../generated/prisma/enums";

const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi!" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        message: "Forbidden: Anda tidak memiliki akses ke resource ini.",
      });
      return;
    }

    next();
  };
};

export { requireRole };
