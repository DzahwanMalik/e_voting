import { useState, useEffect } from "react";
import { Calendar, Layers, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/atoms/Badge";
import { DataTable } from "@/components/organisms/DataTable";
import { LoadingState } from "@/components/molecules/LoadingState";
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
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

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
  }, []);

  const handleDeleteElection = async (election: ElectionListItem) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus pemilihan "${election.title}"? Tindakan ini tidak dapat dibatalkan.`,
    );
    if (!confirmed) {
      return;
    }

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
      key: "candidates",
      header: "Kandidat",
      cell: (row: ElectionListItem) => (
        <Badge variant="default" className="px-2.5 py-0.5">
          {row._count?.candidates ?? 0}
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
      onClick: () => {},
    },
    ...(isSuperAdmin
      ? [
          {
            label: "Hapus Pemilihan",
            icon: <Trash2 className="w-4 h-4" />,
            onClick: (row: ElectionListItem) => handleDeleteElection(row),
            isDestructive: true,
            disabled: (row: ElectionListItem) => isDeletingId === row.id,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-sans text-2xl sm:text-3xl font-bold text-card-foreground tracking-tight">
                Manajemen Pemilihan
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isSuperAdmin
                  ? "Kelola seluruh pemilihan dalam sistem."
                  : "Pemilihan yang ditugaskan kepada Anda."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Elections Table Section */}
      <div className="bg-card rounded-3xl border border-border shadow-sm p-6 sm:p-8">
        <h2 className="font-sans text-xl font-bold text-card-foreground mb-4">
          Daftar Pemilihan ({elections.length})
        </h2>

        {isLoading ? (
          <LoadingState message="Memuat daftar pemilihan..." spinnerSize="lg" />
        ) : (
          <DataTable<ElectionListItem>
            data={elections}
            columns={columns}
            rowOptions={rowOptions}
            isLoading={isLoading}
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
        )}
      </div>
    </div>
  );
};

export default ElectionPage;
