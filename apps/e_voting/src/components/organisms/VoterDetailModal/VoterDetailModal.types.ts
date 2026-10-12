import type { VoterListItem } from "@/services/voter.service";

interface VoterDetailModalProps {
  voter: VoterListItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export type { VoterDetailModalProps };
