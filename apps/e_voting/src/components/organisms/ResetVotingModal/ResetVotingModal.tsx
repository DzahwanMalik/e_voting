import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Modal from "@/components/molecules/Modal";
import type { ResetVotingModalProps } from "./ResetVotingModal.types";

const CONFIRMATION_TEXT = "RESET";

const ResetVotingModal = ({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
}: ResetVotingModalProps) => {
  const [confirmation, setConfirmation] = useState("");

  const isConfirmed = confirmation.trim() === CONFIRMATION_TEXT;

  const handleConfirm = () => {
    if (!isConfirmed || isSubmitting) {
      return;
    }
    void onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <span className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          Reset Seluruh Data Voting
        </span>
      }
      closeButtonDisabled={isSubmitting}
      closeOnBackdropClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      <div className="p-6 overflow-y-auto flex-1 space-y-5">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 space-y-2">
          <p className="text-sm font-semibold text-destructive">
            Tindakan ini tidak dapat dibatalkan.
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground leading-relaxed">
            <li>Seluruh vote pada semua election akan dihapus permanen.</li>
            <li>
              Status seluruh pemilih akan dikembalikan menjadi belum memilih.
            </li>
            <li>
              Data election, paslon, pemilih, dan penugasan admin tidak berubah.
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="reset-confirmation" required>
            Ketik {CONFIRMATION_TEXT} untuk mengonfirmasi
          </Label>
          <Input
            id="reset-confirmation"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder={CONFIRMATION_TEXT}
            autoComplete="off"
            disabled={isSubmitting}
            isInvalid={confirmation.length > 0 && !isConfirmed}
          />
        </div>
      </div>

      <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-muted/30 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Batal
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleConfirm}
          isLoading={isSubmitting}
          disabled={!isConfirmed || isSubmitting}
          icon={<Trash2 className="w-4 h-4" />}
        >
          Reset Semua Data Voting
        </Button>
      </div>
    </Modal>
  );
};

export default ResetVotingModal;
