import type { ElectionListItem } from "@/services/election.service";
import type { UserRole } from "@/stores/useUserStore";

interface ElectionDetailModalProps {
  election: ElectionListItem | null;
  isOpen: boolean;
  onClose: () => void;
  currentUserRole?: UserRole;
  onImportSuccess?: () => void;
}

export type { ElectionDetailModalProps };
export type { ElectionListItem };
export type { UserRole };
