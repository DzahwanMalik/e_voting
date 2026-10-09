import { useState, useEffect } from "react";
import {
  Vote,
  Calendar,
  CheckCircle2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import CandidateRadioCard from "@/components/molecules/CandidateRadioCard";
import VoteConfirmModal from "@/components/organisms/VoteConfirmModal";
import {
  castVoteApi,
  getElectionByIdApi,
  type Candidate,
} from "@/services/election.service";
import type { VoterElectionCardProps } from "./VoterElectionCard.types";

const VoterElectionCard = ({
  election,
  onVoteSuccess,
  onViewCandidateDetail,
}: VoterElectionCardProps) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(
    null,
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchedCandidates, setFetchedCandidates] = useState<Candidate[]>([]);

  const candidates: Candidate[] =
    election.candidates && election.candidates.length > 0
      ? election.candidates
      : fetchedCandidates;

  const hasVoted = Boolean(election.electionVoters?.[0]?.hasVoted);

  useEffect(() => {
    if (
      (!election.candidates || election.candidates.length === 0) &&
      election._count?.candidates &&
      election._count.candidates > 0
    ) {
      let isMounted = true;
      getElectionByIdApi(election.id)
        .then((detail) => {
          if (isMounted && detail.candidates) {
            setFetchedCandidates(detail.candidates);
          }
        })
        .catch(() => {});
      return () => {
        isMounted = false;
      };
    }
  }, [election.candidates, election.id, election._count?.candidates]);

  const selectedCandidate =
    candidates.find((c) => c.id === selectedCandidateId) || null;

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const handleConfirmVote = async () => {
    if (!selectedCandidateId) return;

    setIsSubmitting(true);
    try {
      await castVoteApi({
        electionId: election.id,
        candidateId: selectedCandidateId,
      });

      toast.success(
        `Suara Anda berhasil dicatat untuk ${selectedCandidate?.name || "kandidat"}!`,
      );
      setIsConfirmOpen(false);
      onVoteSuccess(election.id);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal mengirimkan suara pemilihan.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card rounded-3xl border border-border shadow-sm p-6 sm:p-8 space-y-6 flex flex-col justify-between">
      {/* 1. Header of Election Card */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Pemilihan Aktif
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>Dibuat: {formatDate(election.createdAt)}</span>
              </div>
            </div>

            <h2 className="font-sans text-2xl font-bold text-card-foreground tracking-tight">
              {election.title}
            </h2>

            <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
              {election.description ||
                "Tidak ada rincian deskripsi untuk pemilihan ini."}
            </p>
          </div>

          <div className="flex items-center">
            <Badge
              variant={hasVoted ? "success" : "pending"}
              className="px-3.5 py-1 text-sm font-semibold"
            >
              {hasVoted ? (
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Sudah Memilih
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Vote className="w-4 h-4" /> Belum Memilih
                </span>
              )}
            </Badge>
          </div>
        </div>

        {/* 2. Status Notice Banner */}
        {hasVoted ? (
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-success-subtle/50 border border-success-subtle text-success-subtle-foreground text-sm">
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-success" />
            <div>
              <p className="font-semibold">Hak Suara Telah Digunakan</p>
              <p className="text-xs text-success-subtle-foreground/90 mt-0.5 leading-relaxed">
                Terima kasih! Anda telah menggunakan hak suara Anda untuk pemilihan ini. Suara telah tercatat secara aman dan rahasia.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-secondary/50 border border-secondary text-secondary-foreground text-sm">
            <Vote className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
            <div>
              <p className="font-semibold">Pilih Kandidat Anda</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Pilih salah satu calon kandidat di bawah ini sebagai pilihan Anda, kemudian klik tombol <strong>Kirim Suara</strong> pada bagian bawah kartu.
              </p>
            </div>
          </div>
        )}

        {/* 3. Candidates List / Radio Grid */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-lg text-card-foreground">
              Daftar Calon Kandidat ({candidates.length})
            </h3>
            {!hasVoted && selectedCandidate && (
              <span className="text-xs text-primary font-medium">
                Pilihan saat ini: {selectedCandidate.name}
              </span>
            )}
          </div>

          {candidates.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {candidates.map((candidate, idx) => (
                <CandidateRadioCard
                  key={candidate.id}
                  candidate={candidate}
                  candidateNumber={idx + 1}
                  isSelected={selectedCandidateId === candidate.id}
                  disabled={hasVoted}
                  onSelect={() => setSelectedCandidateId(candidate.id)}
                  onViewDetail={() => onViewCandidateDetail(candidate)}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-muted border border-border text-center space-y-1">
              <AlertCircle className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
              <p className="text-sm font-semibold text-card-foreground">
                Belum Ada Kandidat Terdaftar
              </p>
              <p className="text-xs text-muted-foreground">
                Panitia belum mendaftarkan kandidat untuk pemilihan ini.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Footer of Election Card with Vote Button */}
      <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20 p-4 rounded-2xl">
        <div>
          {hasVoted ? (
            <div className="flex items-center gap-2 text-xs font-medium text-success-subtle-foreground">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Suara Anda telah tercatat sah (One-Vote-Per-Election).</span>
            </div>
          ) : selectedCandidate ? (
            <div className="text-sm">
              <span className="text-xs text-muted-foreground block">
                Kandidat yang akan dipilih:
              </span>
              <span className="font-semibold text-foreground">
                {selectedCandidate.name}
              </span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">
              Silakan pilih salah satu kandidat di atas untuk mengaktifkan tombol vote.
            </span>
          )}
        </div>

        <div>
          {hasVoted ? (
            <Button
              variant="secondary"
              size="sm"
              disabled
              icon={<CheckCircle2 className="w-4 h-4 text-success" />}
            >
              Sudah Memilih
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              disabled={!selectedCandidateId || isSubmitting}
              isLoading={isSubmitting}
              onClick={() => setIsConfirmOpen(true)}
              icon={<Vote className="w-4 h-4" />}
            >
              Kirim Suara
            </Button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <VoteConfirmModal
        candidate={selectedCandidate}
        electionTitle={election.title}
        isOpen={isConfirmOpen}
        isSubmitting={isSubmitting}
        onClose={() => {
          if (!isSubmitting) setIsConfirmOpen(false);
        }}
        onConfirm={handleConfirmVote}
      />
    </div>
  );
};

export default VoterElectionCard;

