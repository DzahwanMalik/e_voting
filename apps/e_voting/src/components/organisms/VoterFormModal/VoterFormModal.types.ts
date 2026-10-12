import type { VoterListItem } from "@/services/voter.service";
import type { ElectionListItem } from "@/services/election.service";

type VoterFormMode = "create" | "edit";

interface VoterFormModalProps {
  mode: VoterFormMode;
  voter: VoterListItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

interface ElectionOption {
  election: ElectionListItem;
  isEnrolled: boolean;
}

export type { VoterFormModalProps, VoterFormMode, ElectionOption };
