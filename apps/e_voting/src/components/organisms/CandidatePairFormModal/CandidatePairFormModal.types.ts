import type { CandidatePairListItem } from "@/services/election.service";

type CandidatePairFormMode = "create" | "edit";

interface CandidatePairFormModalProps {
  mode: CandidatePairFormMode;
  pair: CandidatePairListItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export type { CandidatePairFormModalProps, CandidatePairFormMode };
