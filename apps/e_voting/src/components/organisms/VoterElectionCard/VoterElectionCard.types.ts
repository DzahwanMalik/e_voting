import type { ElectionListItem, Candidate } from "@/services/election.service";

interface VoterElectionCardProps {
  election: ElectionListItem;
  onVoteSuccess: (electionId: number) => void;
  onViewCandidateDetail: (candidate: Candidate) => void;
}

export type { VoterElectionCardProps };
