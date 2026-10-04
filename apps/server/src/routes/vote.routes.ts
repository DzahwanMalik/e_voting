import { Router } from "express";
import { UserRole } from "../generated/prisma/enums";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import {
  castVote,
  getVotingStatus,
  getElectionResults,
} from "../controllers/vote.controller";

const router = Router();

// Vote casting (Voter only - BR-01, Section 7)
router.post("/", authenticate, requireRole(UserRole.VOTER), castVote);

// Check voting status (Voter, Admin, Super Admin)
router.get("/status/:electionId", authenticate, getVotingStatus);

// Election result (Super Admin only - BR-12, Section 9)
router.get(
  "/results/:electionId",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN),
  getElectionResults,
);

export default router;
