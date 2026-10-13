import type { CandidatePair } from "@/services/election.service";

type CandidatePairFormMode = "create" | "edit";

interface CandidatePairFormModalProps {
  mode: CandidatePairFormMode;
  pair: CandidatePair | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export type { CandidatePairFormModalProps, CandidatePairFormMode };
