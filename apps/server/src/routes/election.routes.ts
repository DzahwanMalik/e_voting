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
import {
  getElectionVoters,
  enrollVoters,
  removeVoterFromElection,
} from "../controllers/voter.controller";
import {
  castVote,
  getVotingStatus,
  getElectionResults,
} from "../controllers/vote.controller";

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

// Voter Management (Election-scoped)
router.get(
  "/:id/voters",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  getElectionVoters,
);
router.post(
  "/:id/voters",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  enrollVoters,
);
router.delete(
  "/:id/voters/:voterId",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  removeVoterFromElection,
);

// Voting & Results (Election-scoped)
router.post(
  "/:id/vote",
  authenticate,
  requireRole(UserRole.VOTER),
  castVote,
);
router.get(
  "/:id/vote/status",
  authenticate,
  getVotingStatus,
);
router.get(
  "/:id/results",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN),
  getElectionResults,
);

export default router;
