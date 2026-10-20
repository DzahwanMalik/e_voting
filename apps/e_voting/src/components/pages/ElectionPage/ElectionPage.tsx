import { useState, useEffect } from "react";
import { Layers, Plus } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/atoms/Button";
import SectionCard from "@/components/molecules/SectionCard";
import EmptyState from "@/components/molecules/EmptyState";
import LoadingState from "@/components/molecules/LoadingState";
import ConfirmModal from "@/components/molecules/ConfirmModal";
import AdminElectionCard from "@/components/organisms/AdminElectionCard";
import AdminAssignmentModal from "@/components/organisms/AdminAssignmentModal";
import ImportVotersModal from "@/components/organisms/ImportVotersModal";
import ElectionDetailModal from "@/components/organisms/ElectionDetailModal";
import ElectionFormModal from "@/components/organisms/ElectionFormModal";
import { useUserStore } from "@/stores/useUserStore";
import {
  getElectionsApi,
  deleteElectionApi,
  type ElectionListItem,
} from "@/services/election.service";

const ElectionPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [elections, setElections] = useState<ElectionListItem[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
  const [deleteConfirmElection, setDeleteConfirmElection] =
    useState<ElectionListItem | null>(null);
  const [adminAssignmentElection, setAdminAssignmentElection] =
    useState<ElectionListItem | null>(null);
  const [importVotersElection, setImportVotersElection] =
    useState<ElectionListItem | null>(null);
  const [detailElection, setDetailElection] = useState<ElectionListItem | null>(
    null,
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editElection, setEditElection] = useState<ElectionListItem | null>(
    null,
  );

  const isSuperAdmin = useUserStore((state) => state.isSuperAdmin());

  useEffect(() => {
    let isMounted = true;

    const loadElections = async () => {
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
          setIsLoading(false);
        }
      }
    };

    void loadElections();
    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const handleDeleteElection = async (election: ElectionListItem) => {
    setIsDeletingId(election.id);
    try {
      await deleteElectionApi(election.id);
      toast.success(`Pemilihan "${election.title}" berhasil dihapus.`);
      setElections((prev) => prev.filter((e) => e.id !== election.id));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menghapus pemilihan.";
      toast.error(message);
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmElection) {
      void handleDeleteElection(deleteConfirmElection);
    }
  };

  const handleRefreshElections = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleCreateElection = () => {
    setFormMode("create");
    setEditElection(null);
    setIsFormOpen(true);
  };

  const handleEditElection = (election: ElectionListItem) => {
    setFormMode("edit");
    setEditElection(election);
    setIsFormOpen(true);
  };

  const handleFormSaved = () => {
    setIsFormOpen(false);
    handleRefreshElections();
  };

  const getEmptyStateContent = () => {
    if (isSuperAdmin) {
      return {
        title: "Belum Ada Pemilihan",
        description: "Belum ada pemilihan yang dibuat.",
      };
    }

    return {
      title: "Belum Ada Penugasan Pemilihan",
      description:
        "Super Admin belum menugaskan pemilihan kepada akun Anda.",
    };
  };

  const emptyState = getEmptyStateContent();

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <SectionCard padding="default">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-sans text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground tracking-tight">
                Manajemen Pemilihan
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isSuperAdmin
                  ? "Kelola seluruh pemilihan dalam sistem."
                  : "Pemilihan yang ditugaskan kepada Anda."}
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Elections Card Grid Section */}
        <SectionCard
          title={`Daftar Pemilihan (${elections.length})`}
          padding="none"
        >
          <div className="p-4 sm:p-6 lg:p-8 space-y-4">
            {isSuperAdmin && (
              <div className="flex justify-end items-center">
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={handleCreateElection}
                >
                  Tambah Pemilihan
                </Button>
              </div>
            )}

            {isLoading ? (
              <LoadingState message="Memuat daftar pemilihan..." />
            ) : elections.length === 0 ? (
              <EmptyState
                title={emptyState.title}
                description={emptyState.description}
              />
            ) : (
              <div
                className={`grid grid-cols-1 gap-4${
                  elections.length > 1 ? " xl:grid-cols-2" : ""
                }`}
              >
                {elections.map((election) => (
                  <AdminElectionCard
                    key={election.id}
                    election={election}
                    isDeleting={isDeletingId === election.id}
                    showResult={isSuperAdmin}
                    refreshKey={refreshKey}
                    onViewDetail={setDetailElection}
                    onEdit={handleEditElection}
                    onImportVoters={setImportVotersElection}
                    onDelete={
                      isSuperAdmin ? setDeleteConfirmElection : undefined
                    }
                    onManageAdmins={
                      isSuperAdmin ? setAdminAssignmentElection : undefined
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      <AdminAssignmentModal
        electionId={adminAssignmentElection?.id ?? 0}
        electionTitle={adminAssignmentElection?.title ?? ""}
        isOpen={adminAssignmentElection !== null}
        onClose={() => setAdminAssignmentElection(null)}
        onSaved={handleRefreshElections}
      />

      <ImportVotersModal
        electionId={importVotersElection?.id ?? 0}
        electionTitle={importVotersElection?.title ?? ""}
        isOpen={importVotersElection !== null}
        onClose={() => setImportVotersElection(null)}
        onImportSuccess={handleRefreshElections}
      />

      <ElectionDetailModal
        election={detailElection}
        isOpen={detailElection !== null}
        onClose={() => setDetailElection(null)}
      />

      <ConfirmModal
        isOpen={deleteConfirmElection !== null}
        message={
          deleteConfirmElection
            ? `Apakah Anda yakin ingin menghapus pemilihan "${deleteConfirmElection.title}"? Tindakan ini tidak dapat dibatalkan.`
            : ""
        }
        confirmLabel="Hapus"
        isDestructive
        isSubmitting={isDeletingId !== null}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteConfirmElection(null)}
      />

      {/* Election Form Modal (Create/Edit) — Super Admin creates, Super Admin + Admin edit */}
      <ElectionFormModal
        mode={formMode}
        election={editElection}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSaved={handleFormSaved}
      />
    </>
  );
};

export default ElectionPage;
