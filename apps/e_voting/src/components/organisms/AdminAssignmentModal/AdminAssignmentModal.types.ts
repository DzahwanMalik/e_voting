interface AdminAssignmentModalProps {
  electionId: number;
  electionTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export type { AdminAssignmentModalProps };
