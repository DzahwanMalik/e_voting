import { useState } from "react";
import { Calendar, Camera, Compass, Target, User } from "lucide-react";
import Button from "@/components/atoms/Button";
import ImagePreview from "@/components/molecules/ImagePreview";
import Modal from "@/components/molecules/Modal";
import type { CandidatePairDetailModalProps } from "./CandidatePairDetailModal.types";

const CandidatePairDetailModal = ({
  candidatePair,
  isOpen,
  onClose,
}: CandidatePairDetailModalProps) => {
  const [failedCandidateIds, setFailedCandidateIds] = useState<Set<number>>(
    new Set(),
  );

  if (!candidatePair) return null;

  const { candidate: calon, vice: wakil, vision, mission } = candidatePair;

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
      size === "sm" ? "w-24 h-24 sm:w-28 sm:h-28" : "w-20 h-20 rounded-xl";

    const hasError = failedCandidateIds.has(id);

    if (photoUrl && !hasError) {
      return (
        <ImagePreview
          src={photoUrl}
          alt={name}
          caption={name}
          onError={() =>
            setFailedCandidateIds((prev) => new Set([...prev, id]))
          }
          className={`bg-muted border border-border shrink-0 ${sizeClass}`}
          imageClassName="w-full h-full object-cover object-top"
        />
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

        {/* Pair Photo */}
        {candidatePair.photoUrl && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground uppercase tracking-wider">
              <Camera className="w-4 h-4 text-primary" />
              <span>Foto Pasangan</span>
            </div>
            <ImagePreview
              src={candidatePair.photoUrl}
              alt={`${calon.name} & ${wakil.name}`}
              caption={`${calon.name} & ${wakil.name}`}
              className="w-full aspect-video rounded-2xl border border-border"
              imageClassName="w-full h-full object-cover object-center"
            />
          </div>
        )}

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
      <div className="px-6 py-4 border-t border-border flex items-center justify-end bg-muted/30">
        <Button variant="outline" size="sm" onClick={onClose}>
          Tutup
        </Button>
      </div>
    </Modal>
  );
};

export default CandidatePairDetailModal;
