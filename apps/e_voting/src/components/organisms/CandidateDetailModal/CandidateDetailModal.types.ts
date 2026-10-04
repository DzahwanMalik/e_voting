import type { Candidate } from "@/services/election.service";

interface CandidateDetailModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  hasVotedInElection: boolean;
  onClose: () => void;
  onVote: (candidate: Candidate) => void;
}

export type { CandidateDetailModalProps };
