import type { CandidatePair } from "@/services/election.service";

interface CandidateCardProps {
  candidatePair: CandidatePair;
  hasVotedInElection: boolean;
  onViewDetail: (candidatePair: CandidatePair) => void;
  onSelectVote: (candidatePair: CandidatePair) => void;
}

export type { CandidateCardProps };