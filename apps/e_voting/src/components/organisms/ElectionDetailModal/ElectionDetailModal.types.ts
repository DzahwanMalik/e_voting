import type { ElectionListItem } from "@/services/election.service";

interface ElectionDetailModalProps {
  election: ElectionListItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export type { ElectionDetailModalProps };
export type { ElectionListItem };
