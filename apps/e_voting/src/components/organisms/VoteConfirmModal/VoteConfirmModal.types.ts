import type { Candidate } from "@/services/election.service";

interface VoteConfirmModalProps {
  candidate: Candidate | null;
  electionTitle: string;
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export type { VoteConfirmModalProps };
