import { useState } from "react";
import { Vote, FileText, CheckCircle2, User } from "lucide-react";
import Button from "@/components/atoms/Button";
import type { CandidateCardProps } from "./CandidateCard.types";

const CandidateCard = ({
  candidate,
  hasVotedInElection,
  onViewDetail,
  onSelectVote,
}: CandidateCardProps) => {
  const [imageError, setImageError] = useState(false);

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
    <div className="bg-card rounded-2xl border border-border p-5 flex flex-col justify-between shadow-xs hover:border-border-hover transition-all duration-200">
      <div>
        {/* Photo with Fallback */}
        <div className="relative w-full h-52 rounded-xl overflow-hidden bg-muted border border-border mb-4">
          {candidate.photoUrl && !imageError ? (
            <img
              src={candidate.photoUrl}
              alt={candidate.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/50 text-secondary-foreground p-4 text-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-2 text-primary">
                <User className="w-8 h-8" />
              </div>
              <span className="font-heading font-bold text-2xl tracking-wider">
                {getInitials(candidate.name)}
              </span>
            </div>
          )}

        </div>

        {/* Name and Summary */}
        <div className="space-y-1.5 mb-4">
          <h3 className="font-sans font-bold text-xl text-card-foreground tracking-tight">
            {candidate.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {candidate.description || "Tidak ada ringkasan profil kandidat."}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-border flex flex-col gap-2 mt-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetail(candidate)}
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
            onClick={() => onSelectVote(candidate)}
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

