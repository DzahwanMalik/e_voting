import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";
import Modal from "@/components/molecules/Modal";
import type { DeleteAllVotersModalProps } from "./DeleteAllVotersModal.types";

const REQUIRED_CONFIRMATION_TEXT = "HAPUS SEMUA";

const DeleteAllVotersModal = ({
  isOpen,
  voterCount,
  isSubmitting = false,
  onClose,
  onConfirm,
}: DeleteAllVotersModalProps) => {
  const [confirmation, setConfirmation] = useState("");

  const isConfirmationValid =
    confirmation.trim().toUpperCase() === REQUIRED_CONFIRMATION_TEXT;

  const countSuffix =
    typeof voterCount === "number" ? ` (${voterCount} voter)` : "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <span className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          Hapus Semua Voter
        </span>
      }
      closeButtonDisabled={isSubmitting}
      closeOnBackdropClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      <div className="p-6 space-y-5 overflow-y-auto flex-1 scrollbar-none">
        <div className="flex items-start gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/10">
          <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            <p className="font-semibold text-destructive">
              Tindakan ini permanen dan tidak dapat dibatalkan.
            </p>
            <p>
              Seluruh akun voter beserta seluruh pendaftarannya pada election
              akan dihapus{countSuffix}, tanpa memandang pencarian atau filter
              yang sedang aktif.
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>
                Election, candidate, candidate pair, dan admin assignment tidak
                diubah.
              </li>
              <li>
                Vote yang sudah tercatat tetap tersimpan dan tetap dihitung pada
                result karena vote bersifat anonim.
              </li>
              <li>Voter yang dihapus tidak dapat login kembali.</li>
            </ul>
          </div>
        </div>

        <FormField
          id="delete-all-voters-confirmation"
          label={`Ketik "${REQUIRED_CONFIRMATION_TEXT}" untuk mengonfirmasi`}
          required
          hint="Konfirmasi tidak membedakan huruf besar/kecil."
        >
          <Input
            id="delete-all-voters-confirmation"
            type="text"
            value={confirmation}
            placeholder={REQUIRED_CONFIRMATION_TEXT}
            autoComplete="off"
            autoFocus
            disabled={isSubmitting}
            onChange={(event) => setConfirmation(event.target.value)}
          />
        </FormField>
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
          icon={<Trash2 className="w-4 h-4" />}
          isLoading={isSubmitting}
          disabled={!isConfirmationValid}
          onClick={onConfirm}
        >
          Hapus Semua Voter
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteAllVotersModal;
