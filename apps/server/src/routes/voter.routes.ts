import { Router } from "express";
import { UserRole } from "../generated/prisma/enums";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import {
  createVoter,
  getVoters,
  getVoterById,
  updateVoter,
  deleteVoter,
  enrollVoterToElections,
  removeVoterFromElection,
} from "../controllers/voter.controller";

const router = Router();

// Voter CRUD
router.get(
  "/",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  getVoters,
);
router.post(
  "/",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  createVoter,
);
router.get("/:id", authenticate, getVoterById);
router.put(
  "/:id",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  updateVoter,
);
router.delete(
  "/:id",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  deleteVoter,
);

// Voter-centric election eligibility management
router.post(
  "/:id/elections",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  enrollVoterToElections,
);
router.delete(
  "/:id/elections/:electionId",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  removeVoterFromElection,
);

export default router;
