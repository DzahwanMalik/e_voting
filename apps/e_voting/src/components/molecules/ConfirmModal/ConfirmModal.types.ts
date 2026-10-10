import type { ModalSize } from "@/components/molecules/Modal";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isSubmitting?: boolean;
  size?: ModalSize;
}

export type { ConfirmModalProps };
