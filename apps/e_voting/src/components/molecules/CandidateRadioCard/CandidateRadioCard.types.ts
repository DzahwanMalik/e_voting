import type { CandidatePair } from "@/services/election.service";

interface CandidateRadioCardProps {
  candidatePair: CandidatePair;
  isSelected: boolean;
  disabled?: boolean;
  onSelect: () => void;
  onViewDetail: () => void;
}

export type { CandidateRadioCardProps };