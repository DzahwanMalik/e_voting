import { useState } from "react";
import { Calendar, Compass, Target, Vote, User } from "lucide-react";
import Button from "@/components/atoms/Button";
import Modal from "@/components/molecules/Modal";
import type { CandidateDetailModalProps } from "./CandidateDetailModal.types";

const CandidateDetailModal = ({
  candidatePair,
  isOpen,
  hasVotedInElection,
  onClose,
  onVote,
}: CandidateDetailModalProps) => {
  const [failedCandidateIds, setFailedCandidateIds] = useState<Set<number>>(
    new Set(),
  );

  if (!candidatePair) return null;

  const {
    candidate: calon,
    vice: wakil,
    vision,
    mission,
  } = candidatePair;

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

  const renderPhoto = (
    photoUrl: string | null,
    id: number,
    name: string,
    size: "sm" | "lg",
  ) => {
    const sizeClass =
      size === "sm"
        ? "w-24 h-24 sm:w-28 sm:h-28"
        : "w-20 h-20 rounded-xl";

    const hasError = failedCandidateIds.has(id);

    if (photoUrl && !hasError) {
      return (
        <div className={sizeClass}>
          <img
            src={photoUrl}
            alt={name}
            onError={() => setFailedCandidateIds((prev) => new Set([...prev, id]))}
            className="w-full h-full object-cover object-top rounded-2xl"
          />
        </div>
      );
    }

    if (size === "lg") {
      return (
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-muted border border-border flex flex-col items-center justify-center">
          <User className="w-8 h-8 text-primary mb-1" />
          <span className="font-heading font-bold text-lg tracking-wider">
            {getInitials(name)}
          </span>
        </div>
      );
    }

    return (
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-muted border border-border flex flex-col items-center justify-center">
        <User className="w-8 h-8 text-primary mb-1" />
        <span className="font-heading font-bold text-lg tracking-wider">
          {getInitials(name)}
        </span>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      title="Profil Lengkap Paslon"
    >
      {/* Modal Body (Scrollable) */}
      <div className="p-6 overflow-y-auto space-y-6 flex-1">
        {/* Candidate Pair Summary — Calon (main) */}
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          {renderPhoto(calon.photoUrl, calon.id, calon.name, "lg")}

          <div className="space-y-2 flex-1">
            <h2 className="font-sans font-bold text-2xl text-card-foreground">
              {calon.name}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Calon Utama
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Lahir: {formatBirthday(calon.birthday)}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {calon.description || "Tidak ada deskripsi singkat."}
            </p>
          </div>
        </div>

        {/* Candidate Pair Summary — Wakil (vice) */}
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          {renderPhoto(wakil.photoUrl, wakil.id, wakil.name, "lg")}

          <div className="space-y-2 flex-1">
            <h2 className="font-sans font-bold text-2xl text-card-foreground">
              {wakil.name}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Wakil Calon
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Lahir: {formatBirthday(wakil.birthday)}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {wakil.description || "Tidak ada deskripsi singkat."}
            </p>
          </div>
        </div>

        {/* Visi Section (Shared) */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground uppercase tracking-wider">
            <Compass className="w-4 h-4 text-primary" />
            <span>Visi</span>
          </div>
          <div className="p-4 rounded-2xl bg-secondary/40 border border-secondary text-card-foreground text-sm leading-relaxed">
            {vision}
          </div>
        </div>

        {/* Misi Section (Shared) */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground uppercase tracking-wider">
            <Target className="w-4 h-4 text-primary" />
            <span>Misi</span>
          </div>
          <div className="p-4 rounded-2xl bg-muted border border-border text-card-foreground text-sm leading-relaxed whitespace-pre-line">
            {mission}
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
              onVote(candidatePair);
            }}
            icon={<Vote className="w-4 h-4" />}
          >
            Pilih Paslon Ini
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default CandidateDetailModal;