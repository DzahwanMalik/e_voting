import { Calendar, Clock, Users, Shield, Vote } from "lucide-react";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Modal from "@/components/molecules/Modal";
import StatCard from "@/components/molecules/StatCard";
import { formatDate } from "@/lib/utils";
import type { VoterDetailModalProps } from "./VoterDetailModal.types";

const VoterDetailModal = ({
  voter,
  isOpen,
  onClose,
}: VoterDetailModalProps) => {
  if (!voter) return null;

  const electionCount = voter.electionVoters?.length ?? 0;
  const votedCount = voter.electionVoters?.filter((ev) => ev.hasVoted)
    .length ?? 0;
  const unvotedCount = electionCount - votedCount;

  const displayName = voter.name || voter.username;

  const creatorName =
    voter.createdBy?.name || voter.createdBy?.username || "-";
  const creatorRole = voter.createdBy?.role || "-";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      title="Detail Pemilih"
    >
      <div className="p-6 overflow-y-auto flex-1 space-y-6">
        {/* Voter Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="font-sans font-bold text-2xl text-card-foreground">
                {displayName}
              </h2>
              <p className="text-sm text-muted-foreground">@{voter.username}</p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            icon={<Users className="w-4 h-4" />}
            label="Election"
            value={electionCount}
            variant="secondary"
          />
          <StatCard
            icon={<Vote className="w-4 h-4" />}
            label="Sudah Vote"
            value={votedCount}
            variant="info"
          />
          <StatCard
            icon={<Shield className="w-4 h-4" />}
            label="Belum Vote"
            value={unvotedCount}
            variant="warning"
          />
        </div>

        {/* Creator Info */}
        <div className="space-y-2.5">
          <h3 className="font-sans text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Pembuat
          </h3>
          <div className="flex items-center gap-3 p-3 rounded-xl border border-border">
            <Shield className="w-5 h-5 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-sans font-medium text-foreground">
                {creatorName}
              </p>
              <p className="text-sm text-muted-foreground">
                @{voter.createdBy?.username ?? "-"} · Role: {creatorRole}
              </p>
            </div>
            <Badge variant="default" className="text-xs">
              {creatorRole === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
            </Badge>
          </div>
        </div>

        {/* Election Assignments */}
        <div className="space-y-2.5">
          <h3 className="font-sans text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Election yang Diikuti ({electionCount})
          </h3>

          {electionCount === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                Voter ini belum terdaftar pada election manapun.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {voter.electionVoters.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-border"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-medium text-foreground">
                        {ev.election.title}
                      </p>
                      {ev.election.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {ev.election.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant={ev.hasVoted ? "success" : "pending"}
                    className="text-xs"
                  >
                    {ev.hasVoted ? "Sudah Vote" : "Belum Vote"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="space-y-2.5">
          <h3 className="font-sans text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Timeline
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Dibuat: {formatDate(voter.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Clock className="w-4 h-4 text-primary" />
              <span>Diperbarui: {formatDate(voter.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border flex items-center justify-end bg-muted/30">
        <Button variant="outline" size="sm" onClick={onClose}>
          Tutup
        </Button>
      </div>
    </Modal>
  );
};

export default VoterDetailModal;
