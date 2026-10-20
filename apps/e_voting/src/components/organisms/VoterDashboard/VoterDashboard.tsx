import { useState, useEffect } from "react";
import { toast } from "sonner";
import VoterElectionCard from "@/components/organisms/VoterElectionCard";
import CandidatePairDetailModal from "@/components/organisms/CandidatePairDetailModal";
import {
  getElectionsApi,
  type ElectionListItem,
  type CandidatePair,
} from "@/services/election.service";
import LoadingState from "@/components/molecules/LoadingState";
import EmptyState from "@/components/molecules/EmptyState";
import SectionCard from "@/components/molecules/SectionCard";
import type { VoterDashboardProps } from "./VoterDashboard.types";

const VoterDashboard = ({
  displayName,
  onSingleElectionVoted,
}: VoterDashboardProps) => {
  const [isLoadingElections, setIsLoadingElections] = useState(true);
  const [elections, setElections] = useState<ElectionListItem[]>([]);

  // Modal State for inspecting Candidate Pair Profile (Vision, Mission, Birthday)
  const [detailCandidatePair, setDetailCandidatePair] = useState<CandidatePair | null>(
    null,
  );

  // Initial load of elections for the voter
  useEffect(() => {
    let isMounted = true;
    const loadInitialElections = async () => {
      try {
        const data = await getElectionsApi();
        if (isMounted) {
          setElections(data);
        }
      } catch (error) {
        if (isMounted) {
          const message =
            error instanceof Error
              ? error.message
              : "Gagal memuat daftar pemilihan.";
          toast.error(message);
        }
      } finally {
        if (isMounted) {
          setIsLoadingElections(false);
        }
      }
    };

    void loadInitialElections();
    return () => {
      isMounted = false;
    };
  }, []);

  // Callback when vote is successfully recorded in an election card
  const handleVoteSuccess = (electionId: number) => {
    setElections((prev) =>
      prev.map((e) =>
        e.id === electionId
          ? {
              ...e,
              electionVoters: [{ hasVoted: true }],
            }
          : e,
      ),
    );

    // A voter scoped to a single election has no remaining action after voting,
    // so hand over to the page to end the session automatically.
    if (elections.length === 1 && elections[0].id === electionId) {
      onSingleElectionVoted?.();
    }
  };

  return (
    <div className="space-y-8">
      {/* Voter Welcome Banner */}
      <SectionCard
        className="relative overflow-hidden"
        padding="default"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <h1 className="font-sans text-2xl sm:text-3xl font-bold text-card-foreground tracking-tight">
              Selamat Datang, {displayName}!
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Gunakan hak suara Anda secara demokratis, langsung, umum, bebas, dan rahasia. Silakan tentukan pilihan Anda pada masing-masing kartu pemilihan di bawah ini.
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Loading Initial State */}
      {isLoadingElections && (
        <LoadingState
          message="Memuat data pemilihan Anda..."
          textSize="lg"
        />
      )}

      {/* Empty State: Voter not enrolled in any election */}
      {!isLoadingElections && elections.length === 0 && (
        <EmptyState
          title="Belum Ada Pemilihan Aktif"
          description="Akun Anda saat ini belum terdaftar dalam pemilihan aktif manapun. Silakan hubungi Administrator organisasi untuk pendaftaran keikutsertaan pemilihan."
        />
      )}

      {/* Grid Container of Election Cards (Grid Col 1 on mobile, Grid Col 2 on desktop jika lebih dari 1 election) */}
      {!isLoadingElections && elections.length > 0 && (
        <div className={`grid grid-cols-1 gap-6 items-start${elections.length > 1 ? " lg:grid-cols-2" : ""}`}>
          {elections.map((election) => (
            <VoterElectionCard
              key={election.id}
              election={election}
              onVoteSuccess={handleVoteSuccess}
              onViewCandidateDetail={(candidatePair) =>
                setDetailCandidatePair(candidatePair)
              }
            />
          ))}
        </div>
      )}

      {/* Candidate Detail Modal (Inspection only) */}
      <CandidatePairDetailModal
        candidatePair={detailCandidatePair}
        isOpen={Boolean(detailCandidatePair)}
        onClose={() => setDetailCandidatePair(null)}
      />
    </div>
  );
};

export default VoterDashboard;