import { AlertCircle, Vote } from "lucide-react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Modal from "@/components/molecules/Modal";
import type { VoteConfirmModalProps } from "./VoteConfirmModal.types";

const VoteConfirmModal = ({
  candidate,
  electionTitle,
  isOpen,
  isSubmitting,
  onClose,
  onConfirm,
}: VoteConfirmModalProps) => {
  if (!candidate) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={<Badge variant="warning">Konfirmasi Pilihan Suara</Badge>}
      closeButtonDisabled={isSubmitting}
      closeOnEscape={!isSubmitting}
      closeOnBackdropClick={!isSubmitting}
    >
      {/* Body */}
      <div className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary shrink-0 mt-0.5">
            <Vote className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="font-sans font-bold text-xl text-card-foreground">
              Gunakan Hak Suara Anda?
            </h2>
            <p className="text-sm text-muted-foreground">
              Pemilihan:{" "}
              <strong className="text-foreground">{electionTitle}</strong>
            </p>
          </div>
        </div>

        {/* Candidate highlight box */}
        <div className="p-4 rounded-2xl bg-secondary/50 border border-secondary">
          <p className="text-xs uppercase tracking-wider font-semibold text-secondary-foreground mb-1">
            Kandidat Terpilih
          </p>
          <p className="font-sans font-bold text-lg text-foreground">
            {candidate.name}
          </p>
        </div>

        {/* Warning disclaimer per BR-10 / PRD */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-warning-subtle/40 border border-warning-subtle text-xs text-warning-subtle-foreground leading-relaxed">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-warning" />
          <span>
            <strong>Perhatian:</strong> Setiap pemilih hanya berhak
            memberikan 1 suara (One-Vote-Per-Election). Setelah
            dikonfirmasi, suara Anda akan dicatat secara permanen dan{" "}
            <strong>tidak dapat diubah kembali</strong>.
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-muted/30">
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Batal
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={onConfirm}
          isLoading={isSubmitting}
          icon={<Vote className="w-4 h-4" />}
        >
          Konfirmasi &amp; Kirim Suara
        </Button>
      </div>
    </Modal>
  );
};

export default VoteConfirmModal;
