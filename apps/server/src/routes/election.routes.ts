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
import {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} from "../controllers/candidate.controller";

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

// Candidate Management (Election-scoped)
router.get("/:electionId/candidates", authenticate, getCandidates);
router.post(
  "/:electionId/candidates",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  createCandidate,
);
router.get("/:electionId/candidates/:id", authenticate, getCandidateById);
router.put(
  "/:electionId/candidates/:id",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  updateCandidate,
);
router.delete(
  "/:electionId/candidates/:id",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  deleteCandidate,
);

export default router;
