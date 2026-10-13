import { Router } from "express";
import { UserRole } from "../generated/prisma/enums";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import {
  getAllAdmins,
  createAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} from "../controllers/user.controller";

const router = Router();

// Admin CRUD — Super Admin Only (BR-01, BR-03)
router.post(
  "/admins",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN),
  createAdmin,
);
router.get(
  "/admins",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN),
  getAllAdmins,
);
router.get(
  "/admins/:id",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN),
  getAdminById,
);
router.put(
  "/admins/:id",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN),
  updateAdmin,
);
router.delete(
  "/admins/:id",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN),
  deleteAdmin,
);

export default router;
