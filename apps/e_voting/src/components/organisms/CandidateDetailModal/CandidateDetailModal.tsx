import { useState } from "react";
import { Calendar, Compass, Target, Vote, User } from "lucide-react";
import Button from "@/components/atoms/Button";
import Modal from "@/components/molecules/Modal";
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

  if (!candidate) return null;

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      title="Profil Lengkap Kandidat"
    >
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
    </Modal>
  );
};

export default CandidateDetailModal;
