interface DeleteAllVotersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
  voterCount?: number;
}

export type { DeleteAllVotersModalProps };
