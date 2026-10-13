import type { CandidatePair } from "@/services/election.service";

interface CandidatePairDetailModalProps {
  candidatePair: CandidatePair | null;
  isOpen: boolean;
  onClose: () => void;
}

export type { CandidatePairDetailModalProps };
