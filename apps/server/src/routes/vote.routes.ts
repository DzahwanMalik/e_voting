import { Router } from "express";
import { UserRole } from "../generated/prisma/enums";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import {
  castVote,
  resetAllVotes,
  getVotingStatus,
} from "../controllers/vote.controller";
import { getElectionResultById } from "../controllers/result.controller";

const router = Router();

// Vote casting (Voter only - BR-01, Section 7)
router.post("/", authenticate, requireRole(UserRole.VOTER), castVote);

// Reset seluruh data voting (Super Admin only - BR-18)
router.post(
  "/reset",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN),
  resetAllVotes,
);

// Check voting status (Voter, Admin, Super Admin)
router.get("/status/:electionId", authenticate, getVotingStatus);

// Election result (Super Admin only - BR-12, Section 9)
router.get(
  "/results/:electionId",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN),
  getElectionResultById,
);

export default router;
