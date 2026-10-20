import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  Calendar,
  Eye,
  Layers,
  Pencil,
  Shield,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/atoms/Button";
import SectionCard from "@/components/molecules/SectionCard";
import LoadingState from "@/components/molecules/LoadingState";
import VoteResultChart from "@/components/molecules/VoteResultChart";
import {
  getElectionResultApi,
  type ElectionResultData,
} from "@/services/election.service";
import { formatDate } from "@/lib/utils";
import type { AdminElectionCardProps } from "./AdminElectionCard.types";

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

const AdminElectionCard = ({
  election,
  isDeleting = false,
  showResult = false,
  refreshKey = 0,
  onViewDetail,
  onEdit,
  onImportVoters,
  onDelete,
  onManageAdmins,
}: AdminElectionCardProps) => {
  const [resultData, setResultData] = useState<ElectionResultData | null>(null);
  const [isResultLoading, setIsResultLoading] = useState(false);
  const [hasResultError, setHasResultError] = useState(false);

  useEffect(() => {
    if (!showResult) return;

    let isMounted = true;

    const loadResult = async () => {
      setIsResultLoading(true);
      setHasResultError(false);

      try {
        const data = await getElectionResultApi(election.id);
        if (isMounted) {
          setResultData(data);
        }
      } catch (error) {
        if (isMounted) {
          setResultData(null);
          setHasResultError(true);
          const message =
            error instanceof Error
              ? error.message
              : "Gagal memuat hasil pemilihan.";
          toast.error(message);
        }
      } finally {
        if (isMounted) {
          setIsResultLoading(false);
        }
      }
    };

    void loadResult();
    return () => {
      isMounted = false;
    };
  }, [showResult, election.id, refreshKey]);

  const pairCount =
    election._count?.candidatePairs ?? election.candidatePairs?.length ?? 0;
  const voterCount =
    election._count?.electionVoters ?? election.electionVoters?.length ?? 0;
  const adminCount =
    election._count?.electionAdmins ?? election.electionAdmins?.length ?? 0;

  const voted = election.votedCount ?? 0;
  const unvoted = election.unvotedCount ?? Math.max(0, voterCount - voted);
  const percentage = voterCount > 0 ? (voted / voterCount) * 100 : 0;

  return (
    <SectionCard
      padding="default"
      header={
        <div className="flex items-start gap-3 px-6 py-4 border-b border-border">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-sans text-lg font-bold text-card-foreground wrap-break-word">
              {election.title}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>Dibuat {formatDate(election.createdAt)}</span>
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Eye className="w-4 h-4" />}
            onClick={() => onViewDetail(election)}
          >
            Lihat Detail
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<Pencil className="w-4 h-4" />}
            onClick={() => onEdit(election)}
          >
            Edit
          </Button>
          {onImportVoters && (
            <Button
              variant="secondary"
              size="sm"
              icon={<Upload className="w-4 h-4" />}
              onClick={() => onImportVoters(election)}
            >
              Import Voter
            </Button>
          )}
          {onManageAdmins && (
            <Button
              variant="secondary"
              size="sm"
              icon={<Shield className="w-4 h-4" />}
              onClick={() => onManageAdmins(election)}
            >
              Penugasan Admin
            </Button>
          )}
          {onDelete && (
            <Button
              variant="destructive-ghost"
              size="sm"
              icon={<Trash2 className="w-4 h-4" />}
              isLoading={isDeleting}
              onClick={() => onDelete(election)}
            >
              Hapus
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {election.description || "Tidak ada deskripsi untuk pemilihan ini."}
        </p>

        <div className="grid grid-cols-3 gap-2.5">
          <StatTile
            icon={<Layers className="w-3.5 h-3.5" />}
            label="Paslon"
            value={pairCount}
          />
          <StatTile
            icon={<Users className="w-3.5 h-3.5" />}
            label="Pemilih"
            value={voterCount}
          />
          <StatTile
            icon={<Shield className="w-3.5 h-3.5" />}
            label="Admin"
            value={adminCount}
          />
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-card-foreground">
              Partisipasi Pemilih
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              {percentage.toFixed(1)}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-success transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="font-medium text-success">Sudah Memilih {voted}</span>
            <span className="text-muted-foreground">Belum Memilih {unvoted}</span>
          </div>
        </div>

        {showResult && (
          <div className="border-t border-border pt-4">
            {isResultLoading || (!resultData && !hasResultError) ? (
              <LoadingState message="Memuat hasil..." textSize="sm" />
            ) : hasResultError ? (
              <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
                <p className="text-sm font-medium text-card-foreground">
                  Gagal Memuat Hasil
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Hasil voting pemilihan ini belum dapat ditampilkan.
                </p>
              </div>
            ) : resultData && resultData.results.length > 0 ? (
              <VoteResultChart
                results={resultData.results}
                totalVotes={resultData.totalVotes}
              />
            ) : (
              <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
                <p className="text-sm font-medium text-card-foreground">
                  Belum Ada Suara
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Belum ada suara yang tercatat pada pemilihan ini.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </SectionCard>
  );
};

export default AdminElectionCard;
