import { useEffect, useState } from "react";
import { BarChart3, Users, Vote, List } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/atoms/Button";
import LoadingState from "@/components/molecules/LoadingState";
import EmptyState from "@/components/molecules/EmptyState";
import StatCard from "@/components/molecules/StatCard";
import Modal from "@/components/molecules/Modal";
import {
  getElectionResultApi,
  type ElectionResultData,
} from "@/services/election.service";
import type { ElectionResultModalProps } from "./ElectionResultModal.types";

const ElectionResultModal = ({
  electionId,
  electionTitle,
  isOpen,
  onClose,
}: ElectionResultModalProps) => {
  const [resultData, setResultData] = useState<ElectionResultData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const loadResult = async () => {
      setIsLoading(true);
      try {
        const data = await getElectionResultApi(electionId);
        if (isMounted) {
          setResultData(data);
        }
      } catch (error) {
        if (isMounted) {
          const message =
            error instanceof Error
              ? error.message
              : "Gagal memuat hasil pemilihan.";
          toast.error(message);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadResult();
    return () => {
      isMounted = false;
    };
  }, [isOpen, electionId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" title="Hasil Voting">
      <div className="p-6 overflow-y-auto flex-1">
        <h2 className="font-sans font-bold text-xl text-card-foreground mb-1">
          {electionTitle}
        </h2>

        {isLoading ? (
          <LoadingState message="Memuat hasil..." textSize="lg" />
        ) : !resultData ? (
          <EmptyState
            title="Tidak Ada Data Hasil"
            description="Belum ada data hasil voting untuk pemilihan ini."
            icon={<List className="w-8 h-8" />}
          />
        ) : (
          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                icon={<Users className="w-4 h-4" />}
                label="Total Pemilih"
                value={resultData.totalVoters}
                variant="secondary"
              />
              <StatCard
                icon={<Vote className="w-4 h-4" />}
                label="Suara Masuk"
                value={resultData.votedCount}
                variant="info"
              />
              <StatCard
                icon={<BarChart3 className="w-4 h-4" />}
                label="Tingkat Partisipasi"
                value={`${resultData.turnoutPercentage.toFixed(1)}%`}
                variant="warning"
              />
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="font-sans text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Perolehan Suara Paslon
              </h3>

              {resultData.results.length === 0 ? (
                <EmptyState
                  title="Belum Ada Suara"
                  description="Belum ada suara yang tercatat untuk paslon manapun dalam pemilihan ini."
                  icon={<Users className="w-8 h-8" />}
                />
              ) : (
                <div className="space-y-3">
                  {resultData.results.map((pairResult) => (
                    <div
                      key={pairResult.candidatePairId}
                      className="p-4 rounded-2xl border border-border"
                    >
                      {/* Pair header: calon name + wakil name */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex flex-col">
                          <span className="font-sans font-semibold text-foreground">
                            {pairResult.calon.name}
                          </span>
                          <span className="font-sans font-medium text-sm text-muted-foreground">
                            — {pairResult.wakil.name}
                          </span>
                        </div>

                        <span className="font-sans font-bold text-primary text-lg">
                          {pairResult.voteCount} suara
                        </span>
                      </div>

                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${pairResult.percentage}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center mt-2 text-xs">
                        <span className="text-muted-foreground">
                          {pairResult.percentage.toFixed(1)}%
                        </span>
                        <span className="text-muted-foreground">
                          {resultData.totalVotes} total suara
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-border flex items-center justify-end bg-muted/30">
        <Button variant="outline" size="sm" onClick={onClose}>
          Tutup
        </Button>
      </div>
    </Modal>
  );
};

export default ElectionResultModal;
