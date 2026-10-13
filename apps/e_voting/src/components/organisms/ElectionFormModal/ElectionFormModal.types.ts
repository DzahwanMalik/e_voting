import type { ElectionListItem } from "@/services/election.service";

type ElectionFormMode = "create" | "edit";

interface ElectionFormModalProps {
  mode: ElectionFormMode;
  election: ElectionListItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export type { ElectionFormModalProps, ElectionFormMode };
