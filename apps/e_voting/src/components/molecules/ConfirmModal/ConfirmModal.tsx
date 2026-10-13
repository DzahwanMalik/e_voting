import { AlertCircle, AlertTriangle } from "lucide-react";
import Button from "@/components/atoms/Button";
import Modal from "@/components/molecules/Modal";
import type { ConfirmModalProps } from "./ConfirmModal.types";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  isDestructive = false,
  isSubmitting = false,
  size = "md",
}: ConfirmModalProps) => {
  const titleText = isDestructive
    ? "Konfirmasi Penghapusan"
    : "Konfirmasi";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      title={
        <span className="flex items-center gap-2">
          {isDestructive ? (
            <AlertTriangle className="w-5 h-5 text-destructive" />
          ) : (
            <AlertCircle className="w-5 h-5 text-warning" />
          )}
          {titleText}
        </span>
      }
      closeButtonDisabled={isSubmitting}
      closeOnBackdropClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      {/* Body */}
      <div className="p-6 overflow-y-auto flex-1 scrollbar-none">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {message}
        </p>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-muted/30 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isSubmitting}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={isDestructive ? "destructive" : "primary"}
          size="sm"
          onClick={onConfirm}
          isLoading={isSubmitting}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
