import { useState } from "react";
import { Vote, FileText, CheckCircle2, User } from "lucide-react";
import Button from "@/components/atoms/Button";
import type { CandidateCardProps } from "./CandidateCard.types";

const CandidateCard = ({
  candidatePair,
  hasVotedInElection,
  onViewDetail,
  onSelectVote,
}: CandidateCardProps) => {
  const [imageError, setImageError] = useState(false);
  const { candidate: calon, vice: wakil } = candidatePair;

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
    name: string,
    size: "md" | "lg",
  ) => {
    const sizeClass =
      size === "md"
        ? "w-14 h-14 sm:w-16 sm:h-16"
        : "w-24 h-24 sm:w-28 sm:h-28";

    if (photoUrl && !imageError) {
      return (
        <img
          src={photoUrl}
          alt={name}
          onError={() => setImageError(true)}
          className={`${sizeClass} rounded-xl overflow-hidden object-cover object-top`}
        />
      );
    }

    const innerIcon = size === "md" ? "w-8 h-8" : "w-8 h-8 sm:w-10 sm:h-10";
    const textSize = size === "md" ? "text-sm sm:text-base" : "text-lg sm:text-2xl";

    return (
      <div
        className={`${sizeClass} rounded-xl overflow-hidden bg-muted border border-border flex flex-col items-center justify-center text-center`}
      >
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-secondary flex items-center justify-center mb-1.5 text-primary">
          <User className={innerIcon} />
        </div>
        <span className={`font-heading font-bold ${textSize} tracking-wider`}>
          {getInitials(name)}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-5 flex flex-col justify-between shadow-xs hover:border-border-hover transition-all duration-200">
      {/* Photo Section — Calon (main) */}
      <div className="flex justify-center mb-4">
        {renderPhoto(calon.photoUrl, calon.name, "lg")}
      </div>

      {/* Names and Summary */}
      <div className="space-y-1.5 mb-4 text-center">
        <div className="space-y-0.5">
          <h3 className="font-sans font-bold text-xl text-card-foreground tracking-tight">
            {calon.name}
          </h3>
          <h4 className="font-sans font-medium text-md text-muted-foreground">
            {wakil.name}
          </h4>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {calon.description ||
            wakil.description ||
            "Tidak ada ringkasan profil kandidat."}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-border flex flex-col gap-2 mt-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetail(candidatePair)}
          icon={<FileText className="w-4 h-4" />}
          className="w-full"
        >
          Lihat Visi &amp; Misi
        </Button>

        {hasVotedInElection ? (
          <Button
            variant="secondary"
            size="sm"
            disabled
            icon={<CheckCircle2 className="w-4 h-4 text-success" />}
            className="w-full cursor-not-allowed opacity-80"
          >
            Hak Suara Digunakan
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onSelectVote(candidatePair)}
            icon={<Vote className="w-4 h-4" />}
            className="w-full"
          >
            Pilih Kandidat
          </Button>
        )}
      </div>
    </div>
  );
};

export default CandidateCard;