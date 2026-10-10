import { Router } from "express";
import { UserRole } from "../generated/prisma/enums";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { getAllAdmins } from "../controllers/user.controller";

const router = Router();

// List all admin users (Super Admin only — used by Admin Assignment feature)
router.get(
  "/admins",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN),
  getAllAdmins,
);

export default router;
