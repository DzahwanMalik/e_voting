import { useState, useEffect } from "react";
import { Award, Calendar, Layers, Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import DataTable from "@/components/organisms/DataTable";
import SectionCard from "@/components/molecules/SectionCard";
import ConfirmModal from "@/components/molecules/ConfirmModal";
import CandidatePairDetailModal from "@/components/organisms/CandidatePairDetailModal";
import CandidatePairFormModal from "@/components/organisms/CandidatePairFormModal";
import { useUserStore } from "@/stores/useUserStore";
import {
  getAllCandidatePairsApi,
  deleteCandidatePairApi,
  type CandidatePairListItem,
} from "@/services/election.service";
import { formatDate } from "@/lib/utils";

const CandidatePairPage = () => {
  const [pairs, setPairs] = useState<CandidatePairListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

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

  const handleEdit = (pair: CandidatePairListItem) => {
    setFormMode("edit");
    setEditPair(pair);
    setIsFormOpen(true);
  };

  const handleFormSaved = () => {
    setIsFormOpen(false);
    setRefreshKey((prev) => prev + 1);
  };

  const columns = [
    {
      key: "election",
      header: "Pemilihan",
      cell: (row: CandidatePairListItem) => (
        <Badge variant="default" className="px-2.5 py-0.5">
          {row.election?.title ?? "-"}
        </Badge>
      ),
    },
    {
      key: "candidate",
      header: "Calon",
      cell: (row: CandidatePairListItem) => (
        <div className="flex flex-col">
          <span className="font-sans font-semibold text-foreground">
            {row.candidate.name}
          </span>
        </div>
      ),
    },
    {
      key: "vice",
      header: "Wakil",
      cell: (row: CandidatePairListItem) => (
        <div className="flex flex-col">
          <span className="font-sans font-semibold text-foreground">
            {row.vice.name}
          </span>
        </div>
      ),
    },
    ...(isSuperAdmin
      ? [
          {
            key: "votes",
            header: "Suara",
            cell: (row: CandidatePairListItem) => (
              <Badge variant="info" className="px-2.5 py-0.5">
                {row._count?.votes ?? 0}
              </Badge>
            ),
          },
        ]
      : []),
    {
      key: "createdAt",
      header: "Dibuat",
      cell: (row: CandidatePairListItem) => (
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
      onClick: (row: CandidatePairListItem) => setDetailPair(row),
    },
    {
      label: "Edit Paslon",
      icon: <Pencil className="w-4 h-4" />,
      onClick: (row: CandidatePairListItem) => handleEdit(row),
    },
    {
      label: "Hapus Paslon",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (row: CandidatePairListItem) => setDeleteConfirmPair(row),
      isDestructive: true,
      disabled: (row: CandidatePairListItem) => isDeletingId === row.id,
    },
  ];

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

        {/* Candidate Pairs Table Section */}
        <SectionCard title={`Daftar Paslon (${pairs.length})`} padding="none">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex justify-end items-center mb-4">
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={handleCreate}
              >
                Tambah Paslon
              </Button>
            </div>
            <DataTable<CandidatePairListItem>
              data={pairs}
              columns={columns}
              rowOptions={rowOptions}
              isLoading={isLoading}
              loadingMessage="Memuat daftar paslon kandidat..."
              emptyTitle="Belum Ada Paslon"
              emptyDescription={
                isSuperAdmin
                  ? "Belum ada paslon kandidat yang dibuat."
                  : "Belum ada paslon pada election yang Anda kelola."
              }
            />
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
