import type { CandidatePair } from "@/services/election.service";

interface CandidateDetailModalProps {
  candidatePair: CandidatePair | null;
  isOpen: boolean;
  hasVotedInElection: boolean;
  onClose: () => void;
  onVote: (candidatePair: CandidatePair) => void;
}

export type { CandidateDetailModalProps };