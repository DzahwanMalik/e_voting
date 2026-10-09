import { useState, useEffect } from "react";
import { X, Calendar, Compass, Target, Vote, User } from "lucide-react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import type { CandidateDetailModalProps } from "./CandidateDetailModal.types";

const CandidateDetailModal = ({
  candidate,
  isOpen,
  hasVotedInElection,
  onClose,
  onVote,
}: CandidateDetailModalProps) => {
  const [failedCandidateId, setFailedCandidateId] = useState<number | null>(
    null,
  );
  const imageError = candidate ? failedCandidateId === candidate.id : false;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !candidate) {
    return null;
  }

  const formatBirthday = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="bg-card w-full max-w-2xl max-h-[90vh] rounded-3xl border border-border shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2">
            <Badge variant="info">Profil Lengkap Kandidat</Badge>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Candidate Profile Summary */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-muted border border-border shrink-0">
              {candidate.photoUrl && !imageError ? (
                <img
                  src={candidate.photoUrl}
                  alt={candidate.name}
                  onError={() => setFailedCandidateId(candidate.id)}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/50 text-secondary-foreground">
                  <User className="w-8 h-8 text-primary mb-1" />
                  <span className="font-heading font-bold text-lg">
                    {getInitials(candidate.name)}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2 flex-1">
              <h2 className="font-sans font-bold text-2xl text-card-foreground">
                {candidate.name}
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Lahir: {formatBirthday(candidate.birthday)}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {candidate.description || "Tidak ada deskripsi singkat."}
              </p>
            </div>
          </div>

          {/* Visi Section */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground uppercase tracking-wider">
              <Compass className="w-4 h-4 text-primary" />
              <span>Visi</span>
            </div>
            <div className="p-4 rounded-2xl bg-secondary/40 border border-secondary text-card-foreground text-sm leading-relaxed">
              {candidate.vision}
            </div>
          </div>

          {/* Misi Section */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground uppercase tracking-wider">
              <Target className="w-4 h-4 text-primary" />
              <span>Misi</span>
            </div>
            <div className="p-4 rounded-2xl bg-muted border border-border text-card-foreground text-sm leading-relaxed whitespace-pre-line">
              {candidate.mission}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-muted/30">
          <Button variant="outline" size="sm" onClick={onClose}>
            Tutup
          </Button>

          {!hasVotedInElection && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                onVote(candidate);
              }}
              icon={<Vote className="w-4 h-4" />}
            >
              Pilih Kandidat Ini
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailModal;

