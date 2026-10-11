import type { Candidate } from "@/services/election.service";

interface CandidateCardProps {
  candidate: Candidate;
  hasVotedInElection: boolean;
  onViewDetail: (candidate: Candidate) => void;
  onSelectVote: (candidate: Candidate) => void;
}

export type { CandidateCardProps };
