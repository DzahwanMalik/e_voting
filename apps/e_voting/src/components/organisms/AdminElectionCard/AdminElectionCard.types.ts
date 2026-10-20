import type { ElectionListItem } from "@/services/election.service";

interface AdminElectionCardProps {
  election: ElectionListItem;
  isDeleting?: boolean;
  showResult?: boolean;
  refreshKey?: number;
  onViewDetail: (election: ElectionListItem) => void;
  onEdit: (election: ElectionListItem) => void;
  onImportVoters?: (election: ElectionListItem) => void;
  onDelete?: (election: ElectionListItem) => void;
  onManageAdmins?: (election: ElectionListItem) => void;
}

export type { AdminElectionCardProps };
