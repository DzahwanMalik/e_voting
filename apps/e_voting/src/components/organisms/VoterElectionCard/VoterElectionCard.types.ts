import type { ElectionListItem, CandidatePair } from "@/services/election.service";

interface VoterElectionCardProps {
  election: ElectionListItem;
  onVoteSuccess: (electionId: number) => void;
  onViewCandidateDetail: (candidatePair: CandidatePair) => void;
}

export type { VoterElectionCardProps };