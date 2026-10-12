import { useState } from "react";
import { FileText, User } from "lucide-react";
import Button from "@/components/atoms/Button";
import type { CandidateRadioCardProps } from "./CandidateRadioCard.types";

const CandidateRadioCard = ({
  candidatePair,
  isSelected,
  disabled = false,
  onSelect,
  onViewDetail,
}: CandidateRadioCardProps) => {
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

  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={disabled ? -1 : 0}
      onClick={() => {
        if (!disabled) onSelect();
      }}
      onKeyDown={(e) => {
        if (!disabled && (e.key === " " || e.key === "Enter")) {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 flex items-center gap-3 ${
        disabled
          ? "opacity-75 cursor-not-allowed bg-muted/40 border-border"
          : isSelected
            ? "bg-secondary/40 border-primary ring-2 ring-primary shadow-xs cursor-pointer"
            : "bg-card border-border hover:border-border-hover hover:bg-accent/40 cursor-pointer"
      }`}
    >
      {/* Left: Pair-Level Campaign Photo */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-muted border border-border shrink-0 relative">
        {candidatePair.photoUrl && !imageError ? (
          <img
            src={candidatePair.photoUrl}
            alt={`${calon.name} & ${wakil.name}`}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/50 text-secondary-foreground text-center">
            <User className="w-6 h-6 sm:w-7 sm:h-7 mb-1" />
            <span className="font-heading font-bold text-xs tracking-wider">
              {getInitials(calon.name)} + {getInitials(wakil.name)}
            </span>
          </div>
        )}
      </div>

      {/* Middle: Candidate Pair Names */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <h4 className="font-sans font-bold text-sm sm:text-base text-card-foreground truncate">
            {calon.name}
          </h4>
          <span className="text-xs text-muted-foreground">·</span>
          <h5 className="font-sans font-medium text-sm sm:text-base text-muted-foreground truncate">
            {wakil.name}
          </h5>
        </div>
      </div>

      {/* Right: Detail Button & Radio Indicator */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail();
          }}
          icon={<FileText className="w-3.5 h-3.5" />}
          className="text-xs h-8 px-2 sm:px-3"
        >
          <span className="hidden sm:inline">Detail</span>
        </Button>

        {/* Radio Indicator */}
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            isSelected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card"
          }`}
        >
          {isSelected && (
            <div className="w-2 h-2 rounded-full bg-primary-foreground" />
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateRadioCard;
