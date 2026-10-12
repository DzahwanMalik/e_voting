import { Router } from "express";
import { UserRole } from "../generated/prisma/enums";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import {
  createCandidatePair,
  getCandidatePairs,
  getCandidatePairById,
  updateCandidatePair,
  deleteCandidatePair,
  getCandidateById,
} from "../controllers/candidatePair.controller";

const router = Router();

// Candidate Pair CRUD (top-level — Super Admin/Admin only)
router.get("/", authenticate, getCandidatePairs);
router.post(
  "/",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  createCandidatePair,
);
router.get("/:id", authenticate, getCandidatePairById);
router.put(
  "/:id",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  updateCandidatePair,
);
router.delete(
  "/:id",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  deleteCandidatePair,
);

// Individual candidate lookup (for form pre-fill)
router.get("/candidate/:id", authenticate, getCandidateById);

export default router;
