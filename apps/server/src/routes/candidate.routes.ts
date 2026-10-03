import { Router } from "express";
import { UserRole } from "../generated/prisma/enums";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} from "../controllers/candidate.controller";

const router = Router();

router.get("/", authenticate, getCandidates);
router.post(
  "/",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  createCandidate,
);
router.get("/:id", authenticate, getCandidateById);
router.put(
  "/:id",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  updateCandidate,
);
router.delete(
  "/:id",
  authenticate,
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  deleteCandidate,
);

export default router;
