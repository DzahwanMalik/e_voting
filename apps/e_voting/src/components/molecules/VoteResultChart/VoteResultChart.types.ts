import type { CandidatePairVoteResult } from "@/services/election.service";

interface VoteResultChartProps {
  results: CandidatePairVoteResult[];
  totalVotes: number;
  className?: string;
}

export type { VoteResultChartProps };
