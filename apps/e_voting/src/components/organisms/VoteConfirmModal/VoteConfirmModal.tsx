import { useEffect } from "react";
import { AlertCircle, Vote, X } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import type { VoteConfirmModalProps } from "./VoteConfirmModal.types";

const VoteConfirmModal = ({
  candidate,
  electionTitle,
  isOpen,
  isSubmitting,
  onClose,
  onConfirm,
}: VoteConfirmModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen || !candidate) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-xs transition-opacity duration-200"
      onClick={() => {
        if (!isSubmitting) onClose();
      }}
    >
      <div
        className="bg-card w-full max-w-lg rounded-3xl border border-border shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
          <Badge variant="warning">Konfirmasi Pilihan Suara</Badge>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-50"
            aria-label="Batal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

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
                Pemilihan: <strong className="text-foreground">{electionTitle}</strong>
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
              <strong>Perhatian:</strong> Setiap pemilih hanya berhak memberikan 1 suara (One-Vote-Per-Election). Setelah dikonfirmasi, suara Anda akan dicatat secara permanen dan <strong>tidak dapat diubah kembali</strong>.
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
      </div>
    </div>
  );
};

export default VoteConfirmModal;
