import { useState, useEffect, useMemo } from "react";
import { Award, Plus } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/atoms/Button";
import SectionCard from "@/components/molecules/SectionCard";
import EmptyState from "@/components/molecules/EmptyState";
import LoadingState from "@/components/molecules/LoadingState";
import ConfirmModal from "@/components/molecules/ConfirmModal";
import TabList, { type TabListItem } from "@/components/molecules/TabList";
import CandidatePairCard from "@/components/organisms/CandidatePairCard";
import CandidatePairDetailModal from "@/components/organisms/CandidatePairDetailModal";
import CandidatePairFormModal from "@/components/organisms/CandidatePairFormModal";
import { useUserStore } from "@/stores/useUserStore";
import {
  getAllCandidatePairsApi,
  deleteCandidatePairApi,
  type CandidatePairListItem,
} from "@/services/election.service";

type ElectionFilter = number | "all";

const CandidatePairPage = () => {
  const [pairs, setPairs] = useState<CandidatePairListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [electionFilter, setElectionFilter] = useState<ElectionFilter | null>(
    null,
  );

  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
  const [deleteConfirmPair, setDeleteConfirmPair] =
    useState<CandidatePairListItem | null>(null);

  const [detailPair, setDetailPair] = useState<CandidatePairListItem | null>(
    null,
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editPair, setEditPair] = useState<CandidatePairListItem | null>(null);

  const isSuperAdmin = useUserStore((state) => state.isSuperAdmin());

  // Pill tab options grouped by election. The options are derived from the
  // already role-scoped pairs, so Admin only ever sees elections they manage.
  const electionTabs = useMemo<TabListItem<ElectionFilter>[]>(() => {
    const grouped = new Map<number, { title: string; count: number }>();

    for (const pair of pairs) {
      const entry = grouped.get(pair.electionId);
      if (entry) {
        entry.count += 1;
      } else {
        grouped.set(pair.electionId, {
          title: pair.election?.title ?? "Pemilihan Tanpa Judul",
          count: 1,
        });
      }
    }

    const tabs: TabListItem<ElectionFilter>[] = [
      { value: "all", label: "Semua", count: pairs.length },
    ];

    const sortedElections = [...grouped.entries()].sort((a, b) =>
      a[1].title.localeCompare(b[1].title),
    );

    for (const [id, { title, count }] of sortedElections) {
      tabs.push({ value: id, label: title, count });
    }

    return tabs;
  }, [pairs]);

  // Only worth showing when there is more than one election to pick from.
  const hasMultipleElections = electionTabs.length > 2;

  // Default selection is the first election tab (index 1), not "Semua".
  const fallbackElectionFilter: ElectionFilter = electionTabs[1]?.value ?? "all";

  // Keep the user's choice while it still exists; otherwise fall back to the
  // first election tab (or "all" while there are no elections yet).
  const activeElectionFilter: ElectionFilter =
    electionFilter !== null &&
    electionTabs.some((tab) => tab.value === electionFilter)
      ? electionFilter
      : fallbackElectionFilter;

  const visiblePairs =
    activeElectionFilter === "all"
      ? pairs
      : pairs.filter((pair) => pair.electionId === activeElectionFilter);

  useEffect(() => {
    let isMounted = true;

    const loadCandidatePairs = async () => {
      setIsLoading(true);
      try {
        const data = await getAllCandidatePairsApi();
        if (isMounted) {
          setPairs(data);
        }
      } catch (error) {
        if (isMounted) {
          const message =
            error instanceof Error
              ? error.message
              : "Gagal memuat daftar paslon kandidat.";
          toast.error(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadCandidatePairs();
    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const handleDeletePair = async (pair: CandidatePairListItem) => {
    setIsDeletingId(pair.id);
    try {
      await deleteCandidatePairApi(pair.id);
      toast.success("Paslon kandidat berhasil dihapus.");
      setPairs((prev) => prev.filter((p) => p.id !== pair.id));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal menghapus paslon kandidat.";
      toast.error(message);
    } finally {
      setIsDeletingId(null);
      setDeleteConfirmPair(null);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmPair) {
      void handleDeletePair(deleteConfirmPair);
    }
  };

  const handleCreate = () => {
    setFormMode("create");
    setEditPair(null);
    setIsFormOpen(true);
  };

  // Explicitly typed so the tab value type is pinned independently of
  // inference on the `TabList` generic.
  const handleElectionFilterChange = (value: ElectionFilter) => {
    setElectionFilter(value);
  };

  const handleEdit = (pair: CandidatePairListItem) => {
    setFormMode("edit");
    setEditPair(pair);
    setIsFormOpen(true);
  };

  const handleFormSaved = () => {
    setIsFormOpen(false);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <SectionCard padding="default">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-sans text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground tracking-tight">
                Manajemen Paslon
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isSuperAdmin
                  ? "Kelola seluruh paslon kandidat dalam sistem."
                  : "Paslon pada election yang Anda kelola."}
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Candidate Pairs Card Grid Section */}
        <SectionCard title={`Daftar Paslon (${visiblePairs.length})`} padding="none">
          <div className="p-4 sm:p-6 lg:p-8 space-y-4">
            <div
              className={`flex flex-col gap-3 overflow-visible sm:flex-row sm:items-center ${
                hasMultipleElections ? "sm:justify-between" : "sm:justify-end"
              }`}
            >
              {hasMultipleElections && (
                <TabList<ElectionFilter>
                  items={electionTabs}
                  value={activeElectionFilter}
                  onChange={handleElectionFilterChange}
                  ariaLabel="Filter paslon berdasarkan pemilihan"
                  className="w-full sm:w-auto sm:min-w-0"
                />
              )}
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={handleCreate}
                className="self-end sm:self-auto shrink-0"
              >
                Tambah Paslon
              </Button>
            </div>

            {isLoading ? (
              <LoadingState message="Memuat daftar paslon kandidat..." />
            ) : pairs.length === 0 ? (
              <EmptyState
                title="Belum Ada Paslon"
                description={
                  isSuperAdmin
                    ? "Belum ada paslon kandidat yang dibuat."
                    : "Belum ada paslon pada election yang Anda kelola."
                }
              />
            ) : visiblePairs.length === 0 ? (
              <EmptyState
                title="Tidak Ada Paslon"
                description="Tidak ada paslon pada pemilihan yang dipilih."
              />
            ) : (
              <div
                className={`grid grid-cols-1 gap-4${
                  visiblePairs.length > 1 ? " xl:grid-cols-2" : ""
                }`}
              >
                {visiblePairs.map((pair) => (
                  <CandidatePairCard
                    key={pair.id}
                    pair={pair}
                    isDeleting={isDeletingId === pair.id}
                    showVotes={isSuperAdmin}
                    onViewDetail={setDetailPair}
                    onEdit={handleEdit}
                    onDelete={setDeleteConfirmPair}
                  />
                ))}
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      {/* Candidate Detail Modal (reused, inspection only) */}
      <CandidatePairDetailModal
        candidatePair={detailPair}
        isOpen={detailPair !== null}
        onClose={() => setDetailPair(null)}
      />

      {/* Candidate Pair Form Modal (Create / Edit) */}
      <CandidatePairFormModal
        mode={formMode}
        pair={editPair}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSaved={handleFormSaved}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmPair !== null}
        message={
          deleteConfirmPair
            ? `Apakah Anda yakin ingin menghapus paslon "${deleteConfirmPair.candidate.name} & ${deleteConfirmPair.vice.name}"? Paslon, foto, dan vote terkait akan ikut terhapus. Tindakan ini tidak dapat dibatalkan.`
            : ""
        }
        confirmLabel="Hapus"
        isDestructive
        isSubmitting={isDeletingId !== null}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteConfirmPair(null)}
      />
    </>
  );
};

export default CandidatePairPage;
