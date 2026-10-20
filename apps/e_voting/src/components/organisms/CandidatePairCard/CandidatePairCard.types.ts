import type { CandidatePairListItem } from "@/services/election.service";

interface CandidatePairCardProps {
  pair: CandidatePairListItem;
  isDeleting?: boolean;
  showVotes?: boolean;
  onViewDetail: (pair: CandidatePairListItem) => void;
  onEdit: (pair: CandidatePairListItem) => void;
  onDelete: (pair: CandidatePairListItem) => void;
}

export type { CandidatePairCardProps };
