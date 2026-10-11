import type { Candidate } from "@/services/election.service";

interface CandidateRadioCardProps {
  candidate: Candidate;
  isSelected: boolean;
  disabled?: boolean;
  onSelect: () => void;
  onViewDetail: () => void;
}

export type { CandidateRadioCardProps };
