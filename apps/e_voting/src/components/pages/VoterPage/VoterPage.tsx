import { useState, useEffect } from "react";
import { Users, Calendar, Layers, Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import DataTable from "@/components/organisms/DataTable";
import LoadingState from "@/components/molecules/LoadingState";
import SectionCard from "@/components/molecules/SectionCard";
import ConfirmModal from "@/components/molecules/ConfirmModal";
import VoterDetailModal from "@/components/organisms/VoterDetailModal";
import VoterFormModal from "@/components/organisms/VoterFormModal";
import { useUserStore } from "@/stores/useUserStore";
import {
  getVotersApi,
  deleteVoterApi,
  type VoterListItem,
} from "@/services/voter.service";
import { formatDate } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

const VoterPage = () => {
  const [voters, setVoters] = useState<VoterListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
  const [deleteConfirmVoter, setDeleteConfirmVoter] =
    useState<VoterListItem | null>(null);

  const [detailVoter, setDetailVoter] = useState<VoterListItem | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editVoter, setEditVoter] = useState<VoterListItem | null>(null);

  const isSuperAdmin = useUserStore((state) => state.isSuperAdmin());
  const currentUser = useUserStore((state) => state.user);

  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  useEffect(() => {
    let isMounted = true;

    const loadVoters = async () => {
      setIsLoading(true);
      try {
        const response = await getVotersApi({
          search: debouncedSearchQuery,
          page: currentPage,
        });
        if (isMounted) {
          setVoters(response.voters);
          setTotalPages(response.meta.totalPages);
          setTotalItems(response.meta.total);
        }
      } catch (error) {
        if (isMounted) {
          const message =
            error instanceof Error
              ? error.message
              : "Gagal memuat daftar pemilih.";
          toast.error(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadVoters();
    return () => {
      isMounted = false;
    };
  }, [debouncedSearchQuery, currentPage, refreshKey]);

  const handleDeleteVoter = async (voter: VoterListItem) => {
    setIsDeletingId(voter.id);
    try {
      await deleteVoterApi(voter.id);
      toast.success(
        `Voter "${voter.name || voter.username}" berhasil dihapus.`,
      );
      setVoters((prev) => prev.filter((v) => v.id !== voter.id));
      setTotalItems((prev) => prev - 1);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menghapus voter.";
      toast.error(message);
    } finally {
      setIsDeletingId(null);
      setDeleteConfirmVoter(null);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmVoter) {
      void handleDeleteVoter(deleteConfirmVoter);
    }
  };

  const handleCreate = () => {
    setFormMode("create");
    setEditVoter(null);
    setIsFormOpen(true);
  };

  const handleEdit = (voter: VoterListItem) => {
    setFormMode("edit");
    setEditVoter(voter);
    setIsFormOpen(true);
  };

  const handleFormSaved = () => {
    setIsFormOpen(false);
    setRefreshKey((prev) => prev + 1);
  };

  const canAdminModify = (row: VoterListItem): boolean => {
    if (isSuperAdmin) return true;
    return row.createdById === currentUser?.id;
  };

  const columns = [
    {
      key: "name",
      header: "Nama",
      cell: (row: VoterListItem) => {
        const displayName = row.name || row.username;
        return (
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <span className="font-sans font-semibold text-foreground">
                {displayName}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "username",
      header: "Username",
      cell: (row: VoterListItem) => (
        <span className="text-muted-foreground">@{row.username}</span>
      ),
    },
    {
      key: "elections",
      header: "Election",
      cell: (row: VoterListItem) => (
        <Badge variant="default" className="px-2.5 py-0.5">
          {row.electionVoters?.length ?? 0}
        </Badge>
      ),
    },
    {
      key: "creator",
      header: "Pembuat",
      cell: (row: VoterListItem) => (
        <span className="text-muted-foreground">
          {row.createdBy?.name || row.createdBy?.username || "-"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Dibuat",
      cell: (row: VoterListItem) => (
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
      onClick: (row: VoterListItem) => setDetailVoter(row),
    },
    {
      label: "Edit Voter",
      icon: <Pencil className="w-4 h-4" />,
      onClick: (row: VoterListItem) => handleEdit(row),
      disabled: (row: VoterListItem) => !canAdminModify(row),
    },
    {
      label: "Hapus Voter",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (row: VoterListItem) => setDeleteConfirmVoter(row),
      isDestructive: true,
      disabled: (row: VoterListItem) =>
        !canAdminModify(row) || isDeletingId === row.id,
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <SectionCard padding="default">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-sans text-2xl sm:text-3xl font-bold text-card-foreground tracking-tight">
                Manajemen Pemilih
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isSuperAdmin
                  ? "Kelola seluruh pemilih dalam sistem."
                  : "Pemilih yang terdaftar pada election yang Anda kelola."}
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Voters Table Section */}
        <SectionCard title={`Daftar Pemilih (${totalItems})`} padding="none">
          <div className="p-6 sm:p-8">
            <div className="flex justify-end items-center mb-4">
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={handleCreate}
              >
                Tambah Voter
              </Button>
            </div>
            {isLoading ? (
              <LoadingState message="Memuat daftar pemilih..." textSize="lg" />
            ) : (
              <DataTable<VoterListItem>
                data={voters}
                columns={columns}
                rowOptions={rowOptions}
                isLoading={isLoading}
                emptyTitle="Belum Ada Pemilih"
                emptyDescription={
                  isSuperAdmin
                    ? "Belum ada voter yang terdaftar dalam sistem."
                    : "Belum ada voter yang terdaftar pada election yang Anda kelola."
                }
                searchProps={{
                  value: searchQuery,
                  onChange: (value) => {
                    setSearchQuery(value);
                    setCurrentPage(1);
                  },
                  placeholder: "Cari pemilih...",
                }}
                paginationProps={{
                  currentPage,
                  totalPages,
                  onPageChange: setCurrentPage,
                  meta: {
                    total: totalItems,
                    totalPages,
                    page: currentPage,
                    limit: 10,
                  },
                }}
              />
            )}
          </div>
        </SectionCard>
      </div>

      {/* Voter Detail Modal */}
      <VoterDetailModal
        voter={detailVoter}
        isOpen={detailVoter !== null}
        onClose={() => setDetailVoter(null)}
      />

      {/* Voter Form Modal (Create / Edit) */}
      <VoterFormModal
        mode={formMode}
        voter={editVoter}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSaved={handleFormSaved}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmVoter !== null}
        message={
          deleteConfirmVoter
            ? `Apakah Anda yakin ingin menghapus voter "${deleteConfirmVoter.name || deleteConfirmVoter.username}"? Tindakan ini tidak dapat dibatalkan.`
            : ""
        }
        confirmLabel="Hapus"
        isDestructive
        isSubmitting={isDeletingId !== null}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteConfirmVoter(null)}
      />
    </>
  );
};

export default VoterPage;
