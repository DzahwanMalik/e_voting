import { useState, useEffect } from "react";
import { Vote, CheckCircle2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/atoms/Button";
import CandidateRadioCard from "@/components/molecules/CandidateRadioCard";
import CandidateCard from "@/components/molecules/CandidateCard";
import VoteConfirmModal from "@/components/organisms/VoteConfirmModal";
import SectionCard from "@/components/molecules/SectionCard";
import {
  castVoteApi,
  getElectionByIdApi,
  type CandidatePair,
} from "@/services/election.service";
import type { VoterElectionCardProps } from "./VoterElectionCard.types";

const VoterElectionCard = ({
  election,
  onVoteSuccess,
  onViewCandidateDetail,
}: VoterElectionCardProps) => {
  const [selectedPairId, setSelectedPairId] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchedPairs, setFetchedPairs] = useState<CandidatePair[]>([]);

  const candidatePairs: CandidatePair[] =
    election.candidatePairs && election.candidatePairs.length > 0
      ? election.candidatePairs
      : fetchedPairs;

  const hasVoted = Boolean(election.electionVoters?.[0]?.hasVoted);

  const [isSingleElection, setIsSingleElection] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkViewMode = async () => {
      if (
        (!election.candidatePairs || election.candidatePairs.length === 0) &&
        election._count?.candidatePairs &&
        election._count.candidatePairs > 0
      ) {
        setIsSingleElection(true);
        try {
          const detail = await getElectionByIdApi(election.id);
          if (isMounted && detail.candidatePairs) {
            setFetchedPairs(detail.candidatePairs);
          }
        } catch {
          // silently fail, grid will show empty state
        }
      }
    };

    void checkViewMode();
    return () => {
      isMounted = false;
    };
  }, [election.candidatePairs, election.id, election._count?.candidatePairs]);

  const selectedPair =
    candidatePairs.find((p) => p.id === selectedPairId) || null;

  const handleConfirmVote = async () => {
    if (!selectedPairId) return;

    setIsSubmitting(true);
    try {
      await castVoteApi({
        electionId: election.id,
        candidatePairId: selectedPairId,
      });

      toast.success(
        `Suara Anda berhasil dicatat untuk ${selectedPair?.candidate.name || "kandidat"} & ${selectedPair?.vice.name || "wakil"}!`,
      );
      setIsConfirmOpen(false);
      setSelectedPairId(null);
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
    <>
      <SectionCard
        title={election.title}
        padding="default"
        footer={
          <div className="flex items-center justify-between gap-4">
            <div>
              {hasVoted ? (
                <span className="text-xs font-medium text-success-subtle-foreground">
                  Suara Anda telah tercatat sah (One-Vote-Per-Election).
                </span>
              ) : selectedPair ? (
                <div className="text-xs">
                  <span className="text-muted-foreground block">
                    Paslon yang akan dipilih:
                  </span>
                  <span className="font-semibold text-foreground">
                    {selectedPair.candidate.name} &amp; {selectedPair.vice.name}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Silakan pilih salah satu paslon di atas untuk mengaktifkan
                  tombol vote.
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
                  disabled={!selectedPairId || isSubmitting}
                  isLoading={isSubmitting}
                  onClick={() => setIsConfirmOpen(true)}
                  icon={<Vote className="w-4 h-4" />}
                >
                  Kirim Suara
                </Button>
              )}
            </div>
          </div>
        }
      >
        {/* Card Body */}
        <div className="space-y-4">
          <div className="pb-5 border-b border-border">
            <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
              {election.description ||
                "Tidak ada rincian deskripsi untuk pemilihan ini."}
            </p>
          </div>

          {/* Status Notice Banner */}
          {hasVoted ? (
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-success-subtle/50 border border-success-subtle text-success-subtle-foreground text-sm">
              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-success" />
              <div>
                <p className="font-semibold">Hak Suara Telah Digunakan</p>
                <p className="text-xs text-success-subtle-foreground/90 mt-0.5 leading-relaxed">
                  Terima kasih! Anda telah menggunakan hak suara Anda untuk
                  pemilihan ini. Suara telah tercatat secara aman dan rahasia.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-secondary/50 border border-secondary text-secondary-foreground text-sm">
              <Vote className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
              <div>
                <p className="font-semibold">Pilih Paslon Kandidat Anda</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Pilih salah satu paslon (calon + wakil) di bawah ini sebagai
                  pilihan Anda, kemudian klik tombol{" "}
                  <strong>Kirim Suara</strong> pada bagian bawah kartu.
                </p>
              </div>
            </div>
          )}

          {/* Candidate Pair Grid / Radio Grid */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-bold text-lg text-card-foreground">
                Daftar Paslon Kandidat ({candidatePairs.length})
              </h3>
            </div>

            {candidatePairs.length > 0 ? (
              <div
                className={`${
                  isSingleElection
                    ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
                    : "flex flex-col gap-2.5"
                }`}
              >
                {candidatePairs.map((pair) =>
                  isSingleElection ? (
                    <CandidateCard
                      key={pair.id}
                      candidatePair={pair}
                      hasVotedInElection={hasVoted}
                      onViewDetail={() => onViewCandidateDetail(pair)}
                      onSelectVote={() => {
                        if (!hasVoted) setSelectedPairId(pair.id);
                      }}
                    />
                  ) : (
                    <CandidateRadioCard
                      key={pair.id}
                      candidatePair={pair}
                      isSelected={selectedPairId === pair.id}
                      disabled={hasVoted}
                      onSelect={() => setSelectedPairId(pair.id)}
                      onViewDetail={() => onViewCandidateDetail(pair)}
                    />
                  ),
                )}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-muted border border-border text-center space-y-1">
                <AlertCircle className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                <p className="text-sm font-semibold text-card-foreground">
                  Belum Ada Paslon Kandidat Terdaftar
                </p>
                <p className="text-xs text-muted-foreground">
                  Panitia belum mendaftarkan paslon untuk pemilihan ini.
                </p>
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Confirmation Modal */}
      <VoteConfirmModal
        candidatePair={selectedPair}
        electionTitle={election.title}
        isOpen={isConfirmOpen}
        isSubmitting={isSubmitting}
        onClose={() => {
          if (!isSubmitting) setIsConfirmOpen(false);
        }}
        onConfirm={handleConfirmVote}
      />
    </>
  );
};

export default VoterElectionCard;
