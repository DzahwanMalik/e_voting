import { useState, useEffect } from "react";
import { AlertCircle, Layers } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { VoterElectionCard } from "@/components/organisms/VoterElectionCard";
import { CandidateDetailModal } from "@/components/organisms/CandidateDetailModal";
import {
  getElectionsApi,
  type ElectionListItem,
  type Candidate,
} from "@/services/election.service";
import type { VoterDashboardProps } from "./VoterDashboard.types";

const VoterDashboard = ({ displayName }: VoterDashboardProps) => {
  const [isLoadingElections, setIsLoadingElections] = useState(true);
  const [elections, setElections] = useState<ElectionListItem[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Modal State for inspecting Candidate Profile (Vision, Mission, Birthday)
  const [detailCandidate, setDetailCandidate] = useState<Candidate | null>(
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
          setFetchError(message);
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

  // Manual refresh handler
  const handleRefresh = async () => {
    setIsLoadingElections(true);
    setFetchError(null);
    try {
      const data = await getElectionsApi();
      setElections(data);
      toast.success("Daftar pemilihan berhasil diperbarui.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal memuat daftar pemilihan.";
      setFetchError(message);
      toast.error(message);
    } finally {
      setIsLoadingElections(false);
    }
  };

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
  };

  return (
    <div className="space-y-8">
      {/* Voter Welcome Banner */}
      <div className="bg-card rounded-3xl border border-border shadow-sm p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <Badge variant="success">Portal Pemilih (Voter)</Badge>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold text-card-foreground tracking-tight">
              Selamat Datang, {displayName}!
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Gunakan hak suara Anda secara demokratis, langsung, umum, bebas, dan rahasia. Silakan tentukan pilihan Anda pada masing-masing kartu pemilihan di bawah ini.
            </p>
          </div>
        </div>
      </div>

      {/* Error State */}
      {fetchError && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{fetchError}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            isLoading={isLoadingElections}
          >
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Loading Initial State */}
      {isLoadingElections && (
        <div className="bg-card rounded-3xl border border-border p-12 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground font-medium">
            Memuat data pemilihan Anda...
          </p>
        </div>
      )}

      {/* Empty State: Voter not enrolled in any election */}
      {!isLoadingElections && !fetchError && elections.length === 0 && (
        <div className="bg-card rounded-3xl border border-border p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h2 className="font-sans text-lg font-bold text-card-foreground">
              Belum Ada Pemilihan Aktif
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Akun Anda saat ini belum terdaftar dalam pemilihan aktif manapun. Silakan hubungi Administrator organisasi untuk pendaftaran keikutsertaan pemilihan.
            </p>
          </div>
        </div>
      )}

      {/* Grid Container of Election Cards (Grid Col 1 on mobile, Grid Col 2 on desktop jika lebih dari 1 election) */}
      {!isLoadingElections && elections.length > 0 && (
        <div className={`grid grid-cols-1 gap-6 items-start${elections.length > 1 ? " lg:grid-cols-2" : ""}`}>
          {elections.map((election) => (
            <VoterElectionCard
              key={election.id}
              election={election}
              onVoteSuccess={handleVoteSuccess}
              onViewCandidateDetail={(candidate) =>
                setDetailCandidate(candidate)
              }
            />
          ))}
        </div>
      )}

      {/* Candidate Detail Modal (Inspection only) */}
      <CandidateDetailModal
        candidate={detailCandidate}
        isOpen={Boolean(detailCandidate)}
        hasVotedInElection={true}
        onClose={() => setDetailCandidate(null)}
        onVote={() => {}}
      />
    </div>
  );
};

export default VoterDashboard;
