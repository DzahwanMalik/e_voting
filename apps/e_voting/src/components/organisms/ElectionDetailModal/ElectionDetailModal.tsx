import { Calendar, Clock, Users, Shield, Layers, Upload } from "lucide-react";
import { useState } from "react";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Modal from "@/components/molecules/Modal";
import ImportVotersModal from "@/components/organisms/ImportVotersModal";
import StatCard from "@/components/molecules/StatCard";
import type { ElectionDetailModalProps } from "./ElectionDetailModal.types";
import { formatDate } from "@/lib/utils";

const ElectionDetailModal = ({
  election,
  isOpen,
  onClose,
  currentUserRole,
  onImportSuccess,
}: ElectionDetailModalProps) => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  if (!election) {
    return null;
  }

  const pairCount =
    election._count?.candidatePairs ?? election.candidatePairs?.length ?? 0;
  const voterCount =
    election._count?.electionVoters ?? election.electionVoters?.length ?? 0;

  const canImportVoters =
    currentUserRole === "SUPER_ADMIN" || currentUserRole === "ADMIN";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      title="Detail Pemilihan"
    >
      <div className="p-6 overflow-y-auto flex-1 space-y-6">
        {/* Election Info */}
        <div className="space-y-3">
          <h2 className="font-sans font-bold text-2xl text-card-foreground">
            {election.title}
          </h2>
          {election.description ? (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {election.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Tidak ada deskripsi.
            </p>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            icon={<Layers className="w-4 h-4" />}
            label="Paslon"
            value={pairCount}
            variant="secondary"
          />
          <StatCard
            icon={<Users className="w-4 h-4" />}
            label="Pemilih"
            value={voterCount}
            variant="info"
          />
          <StatCard
            icon={<Shield className="w-4 h-4" />}
            label="Admin"
            value={
              election._count?.electionAdmins ??
              election.electionAdmins?.length ??
              0
            }
            variant="warning"
          />
        </div>

        {/* Timeline */}
        <div className="space-y-2.5">
          <h3 className="font-sans text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Timeline
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Dibuat: {formatDate(election.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Clock className="w-4 h-4 text-primary" />
              <span>Diperbarui: {formatDate(election.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Candidate Pairs List */}
        {election.candidatePairs && election.candidatePairs.length > 0 ? (
          <div className="space-y-2.5">
            <h3 className="font-sans text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Daftar Paslon ({election.candidatePairs.length})
            </h3>
            <div className="space-y-2">
              {election.candidatePairs.map((pair) => (
                <div
                  key={pair.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border"
                >
                  <div className="flex items-center -space-x-2">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground font-medium text-xs shrink-0 border-2 border-card">
                      {pair.candidate
                        ? pair.candidate.name
                            .split(" ")
                            .map((part) => part[0])
                            .filter(Boolean)
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()
                        : "??"}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-secondary-foreground font-medium text-xs shrink-0 border-2 border-card">
                      {pair.vice
                        ? pair.vice.name
                            .split(" ")
                            .map((part) => part[0])
                            .filter(Boolean)
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()
                        : "??"}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans font-medium text-foreground">
                      {pair.candidate?.name} &amp; {pair.vice?.name}
                    </p>
                    {pair.candidate?.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {pair.candidate.description}
                      </p>
                    )}
                  </div>
                  <Badge variant="default" className="text-xs">
                    No. {pair.id}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Admins List */}
        {election.electionAdmins && election.electionAdmins.length > 0 ? (
          <div className="space-y-2.5">
            <h3 className="font-sans text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Admin Terdaftar ({election.electionAdmins.length})
            </h3>
            <div className="space-y-2">
              {election.electionAdmins.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-border"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-sans font-medium text-foreground">
                        {admin.user.name || admin.user.username}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        @{admin.user.username}
                      </p>
                    </div>
                  </div>
                  <Badge variant="default" className="text-xs">
                    {formatDate(admin.createdAt)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-muted/30">
        {canImportVoters && (
          <Button
            variant="outline"
            size="sm"
            icon={<Upload className="w-4 h-4" />}
            onClick={() => setIsImportModalOpen(true)}
          >
            Import Voter
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={onClose}>
          Tutup
        </Button>
      </div>

      <ImportVotersModal
        electionId={election.id}
        electionTitle={election.title}
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={onImportSuccess}
      />
    </Modal>
  );
};

export default ElectionDetailModal;
