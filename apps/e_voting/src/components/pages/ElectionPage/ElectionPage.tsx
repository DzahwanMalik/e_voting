import { useState, useEffect } from "react";
import {
  Calendar,
  Layers,
  Trash2,
  Shield,
  BarChart3,
  Plus,
  Edit,
} from "lucide-react";
import { toast } from "sonner";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import DataTable from "@/components/organisms/DataTable";
import SectionCard from "@/components/molecules/SectionCard";
import ConfirmModal from "@/components/molecules/ConfirmModal";
import AdminAssignmentModal from "@/components/organisms/AdminAssignmentModal";
import ElectionResultModal from "@/components/organisms/ElectionResultModal";
import ElectionDetailModal from "@/components/organisms/ElectionDetailModal";
import ElectionFormModal from "@/components/organisms/ElectionFormModal";
import { useUserStore } from "@/stores/useUserStore";
import {
  getElectionsApi,
  deleteElectionApi,
  type ElectionListItem,
} from "@/services/election.service";
import { formatDate } from "@/lib/utils";

const ElectionPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [elections, setElections] = useState<ElectionListItem[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
  const [deleteConfirmElection, setDeleteConfirmElection] =
    useState<ElectionListItem | null>(null);
  const [adminAssignmentElection, setAdminAssignmentElection] =
    useState<ElectionListItem | null>(null);
  const [resultElection, setResultElection] = useState<ElectionListItem | null>(
    null,
  );
  const [detailElection, setDetailElection] = useState<ElectionListItem | null>(
    null,
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editElection, setEditElection] = useState<ElectionListItem | null>(
    null,
  );

  const isSuperAdmin = useUserStore((state) => state.isSuperAdmin());
  const currentUserRole = useUserStore((state) => state.user?.role);

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

  const getParticipation = (row: ElectionListItem) => {
    const total = row._count?.electionVoters ?? 0;
    const voted = row.votedCount ?? 0;
    const unvoted = row.unvotedCount ?? Math.max(0, total - voted);
    const percentage = total > 0 ? (voted / total) * 100 : 0;

    return { total, voted, unvoted, percentage };
  };

  const columns = [
    {
      key: "title",
      header: "Judul",
      cell: (row: ElectionListItem) => (
        <div className="flex flex-col">
          <span className="font-sans font-semibold text-foreground">
            {row.title}
          </span>
        </div>
      ),
    },
    {
      key: "candidatePairs",
      header: "Paslon",
      cell: (row: ElectionListItem) => (
        <Badge variant="default" className="px-2.5 py-0.5">
          {row._count?.candidatePairs ?? 0}
        </Badge>
      ),
    },
    {
      key: "voters",
      header: "Pemilih",
      cell: (row: ElectionListItem) => (
        <Badge variant="default" className="px-2.5 py-0.5">
          {row._count?.electionVoters ?? 0}
        </Badge>
      ),
    },
    {
      key: "participation",
      header: "Partisipasi",
      cell: (row: ElectionListItem) => {
        const { voted, unvoted, percentage } = getParticipation(row);

        return (
          <div className="flex min-w-37.5 flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-medium text-success">Sudah {voted}</span>
              <span className="text-muted-foreground">Belum {unvoted}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-success transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-[11px] text-muted-foreground">
              {percentage.toFixed(1)}% partisipasi
            </span>
          </div>
        );
      },
    },
    {
      key: "admins",
      header: "Admin",
      cell: (row: ElectionListItem) => (
        <Badge variant="default" className="px-2.5 py-0.5">
          {row._count?.electionAdmins ?? row.electionAdmins?.length ?? 0}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Dibuat",
      cell: (row: ElectionListItem) => (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(row.createdAt)}</span>
        </div>
      ),
    },
  ];

  const rowOptions = [
    {
      label: "Lihat Detail",
      icon: <Layers className="w-4 h-4" />,
      onClick: (row: ElectionListItem) => setDetailElection(row),
    },
    {
      label: "Edit Pemilihan",
      icon: <Edit className="w-4 h-4" />,
      onClick: (row: ElectionListItem) => handleEditElection(row),
    },
    ...(isSuperAdmin
      ? [
          {
            label: "Penugasan Admin",
            icon: <Shield className="w-4 h-4" />,
            onClick: (row: ElectionListItem) => setAdminAssignmentElection(row),
          },
          {
            label: "Hasil Voting",
            icon: <BarChart3 className="w-4 h-4" />,
            onClick: (row: ElectionListItem) => setResultElection(row),
          },
          {
            label: "Hapus Pemilihan",
            icon: <Trash2 className="w-4 h-4" />,
            onClick: (row: ElectionListItem) => setDeleteConfirmElection(row),
            isDestructive: true,
            disabled: (row: ElectionListItem) => isDeletingId === row.id,
          },
        ]
      : []),
  ];

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

        {/* Elections Table Section */}
        <SectionCard
          title={`Daftar Pemilihan (${elections.length})`}
          padding="none"
        >
          <div className="p-4 sm:p-6 lg:p-8">
            {isSuperAdmin && (
              <div className="flex justify-end items-center mb-4">
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
            <DataTable<ElectionListItem>
              data={elections}
              columns={columns}
              rowOptions={rowOptions}
              isLoading={isLoading}
              loadingMessage="Memuat daftar pemilihan..."
              emptyTitle={
                isSuperAdmin
                  ? "Belum Ada Pemilihan"
                  : "Belum Ada Penugasan Pemilihan"
              }
              emptyDescription={
                isSuperAdmin
                  ? "Belum ada pemilihan yang dibuat."
                  : "Super Admin belum menugaskan pemilihan kepada akun Anda."
              }
            />
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

      <ElectionResultModal
        electionId={resultElection?.id ?? 0}
        electionTitle={resultElection?.title ?? ""}
        isOpen={resultElection !== null}
        onClose={() => setResultElection(null)}
      />

      <ElectionDetailModal
        election={detailElection}
        isOpen={detailElection !== null}
        onClose={() => setDetailElection(null)}
        currentUserRole={currentUserRole}
        onImportSuccess={handleRefreshElections}
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
