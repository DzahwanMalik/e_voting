import { Router } from "express";
import { UserRole } from "../generated/prisma/enums";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import {
  createElection,
  getElections,
  getElectionById,
  updateElection,
  deleteElection,
  assignAdmins,
  removeAdmin,
  getElectionAdmins,
} from "../controllers/election.controller";

const router = Router();

// Election CRUD
router.get("/", authenticate, getElections);
router.get("/:id", authenticate, getElectionById);
router.post("/", authenticate, requireRole(UserRole.SUPER_ADMIN), createElection);
router.put(
  "/:id",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  updateElection,
);
router.delete(
  "/:id",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN),
  deleteElection,
);

// Admin Assignment
router.get(
  "/:id/admins",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  getElectionAdmins,
);
router.post(
  "/:id/admins",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN),
  assignAdmins,
);
router.delete(
  "/:id/admins/:adminId",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN),
  removeAdmin,
);

export default router;
