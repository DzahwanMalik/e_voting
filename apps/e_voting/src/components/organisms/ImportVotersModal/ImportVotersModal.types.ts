interface ImportVotersModalProps {
  electionId: number;
  electionTitle?: string;
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: () => void;
}

export type { ImportVotersModalProps };
