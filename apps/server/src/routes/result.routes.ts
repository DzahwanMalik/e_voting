import { Router } from "express";
import { UserRole } from "../generated/prisma/enums";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import {
  getAllElectionResults,
  getElectionResultById,
  getResultSummary,
} from "../controllers/result.controller";

const router = Router();

// Result Management (Super Admin only - BR-12, PRD Section 9 & 15.6)
router.get(
  "/",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN),
  getAllElectionResults,
);

router.get(
  "/summary",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN),
  getResultSummary,
);

router.get(
  "/:electionId",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN),
  getElectionResultById,
);

export default router;
