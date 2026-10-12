import type { CandidatePair } from "@/services/election.service";

interface VoteConfirmModalProps {
  candidatePair: CandidatePair | null;
  electionTitle: string;
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export type { VoteConfirmModalProps };