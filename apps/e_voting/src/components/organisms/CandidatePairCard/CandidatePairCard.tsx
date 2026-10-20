import { useState } from "react";
import type { ReactNode } from "react";
import {
  Award,
  Calendar,
  Camera,
  Compass,
  Eye,
  Pencil,
  Trash2,
  Vote,
} from "lucide-react";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ImagePreview from "@/components/molecules/ImagePreview";
import SectionCard from "@/components/molecules/SectionCard";
import { formatDate } from "@/lib/utils";
import type { IndividualCandidate } from "@/services/election.service";
import type { CandidatePairCardProps } from "./CandidatePairCard.types";

interface StatTileProps {
  icon: ReactNode;
  label: string;
  value: number;
}

const StatTile = ({ icon, label, value }: StatTileProps) => {
  return (
    <div className="rounded-xl border border-border bg-muted/30 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-1 font-sans text-xl font-bold text-card-foreground">
        {value}
      </p>
    </div>
  );
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

const CandidatePairCard = ({
  pair,
  isDeleting = false,
  showVotes = false,
  onViewDetail,
  onEdit,
  onDelete,
}: CandidatePairCardProps) => {
  const [failedIds, setFailedIds] = useState<Set<number>>(new Set());

  const { candidate, vice } = pair;

  const renderCandidate = (
    person: IndividualCandidate,
    roleLabel: string,
  ): ReactNode => {
    const hasError = failedIds.has(person.id);

    return (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
        {person.photoUrl && !hasError ? (
          <ImagePreview
            src={person.photoUrl}
            alt={person.name}
            caption={person.name}
            onError={() =>
              setFailedIds((prev) => new Set([...prev, person.id]))
            }
            className="w-12 h-12 rounded-full bg-muted border border-border shrink-0"
            imageClassName="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-secondary text-primary flex items-center justify-center shrink-0 border border-border">
            <span className="font-heading font-bold text-sm tracking-wider">
              {getInitials(person.name)}
            </span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-sans text-sm font-semibold text-foreground">
            {person.name}
          </p>
          <p className="text-xs text-muted-foreground">{roleLabel}</p>
        </div>
      </div>
    );
  };

  const voteCount = pair._count?.votes ?? 0;

  return (
    <SectionCard
      padding="default"
      header={
        <div className="flex items-start gap-3 px-6 py-4 border-b border-border">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-sans text-lg font-bold text-card-foreground wrap-break-word">
              {candidate.name} &amp; {vice.name}
            </h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <Badge variant="default" className="px-2.5 py-0.5">
                {pair.election?.title ?? "Tanpa Pemilihan"}
              </Badge>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>Dibuat {formatDate(pair.createdAt)}</span>
              </span>
            </div>
          </div>
        </div>
      }
      footer={
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Eye className="w-4 h-4" />}
            onClick={() => onViewDetail(pair)}
          >
            Lihat Detail
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<Pencil className="w-4 h-4" />}
            onClick={() => onEdit(pair)}
          >
            Edit
          </Button>
          <Button
            variant="destructive-ghost"
            size="sm"
            icon={<Trash2 className="w-4 h-4" />}
            isLoading={isDeleting}
            onClick={() => onDelete(pair)}
          >
            Hapus
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {pair.photoUrl ? (
          <ImagePreview
            src={pair.photoUrl}
            alt={`${candidate.name} & ${vice.name}`}
            caption={`${candidate.name} & ${vice.name}`}
            className="w-full aspect-video rounded-2xl border border-border"
            imageClassName="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="flex w-full aspect-video items-center justify-center rounded-2xl border border-border bg-muted">
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <Camera className="w-6 h-6" />
              <span className="text-xs">Belum ada foto pasangan</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {renderCandidate(candidate, "Calon Utama")}
          {renderCandidate(vice, "Wakil Calon")}
        </div>

        {showVotes && (
          <StatTile
            icon={<Vote className="w-3.5 h-3.5" />}
            label="Perolehan Suara"
            value={voteCount}
          />
        )}

        <div className="rounded-xl border border-border bg-secondary/40 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground">
            <Compass className="w-4 h-4 text-primary" />
            <span>Visi</span>
          </div>
          <p className="mt-2 text-sm text-card-foreground leading-relaxed line-clamp-3">
            {pair.vision || "Belum ada visi untuk paslon ini."}
          </p>
        </div>
      </div>
    </SectionCard>
  );
};

export default CandidatePairCard;
