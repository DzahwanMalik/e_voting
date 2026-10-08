import { useState, useEffect } from "react";
import { Calendar, Eye, Layers } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/atoms/Badge";
import { DataTable } from "@/components/organisms/DataTable";
import {
  getElectionsApi,
  type ElectionListItem,
} from "@/services/election.service";
import { formatDate } from "@/lib/utils";
import type { AdminDashboardProps } from "./AdminDashboard.types";

const AdminDashboard = ({ displayName }: AdminDashboardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [elections, setElections] = useState<ElectionListItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    const loadAssignedElections = async () => {
      try {
        const data = await getElectionsApi();
        if (isMounted) {
          setElections(data);
        }
      } catch (err) {
        if (isMounted) {
          const message =
            err instanceof Error
              ? err.message
              : "Gagal memuat pemilihan yang ditugaskan.";
          toast.error(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadAssignedElections();
    return () => {
      isMounted = false;
    };
  }, []);

  const columns = [
    {
      key: "title",
      header: "Judul Pemilihan",
      cell: (row: ElectionListItem) => (
        <div className="font-medium text-foreground">{row.title}</div>
      ),
    },
    {
      key: "description",
      header: "Deskripsi",
      cell: (row: ElectionListItem) => (
        <p className="text-muted-foreground line-clamp-2">
          {row.description || "Tidak ada deskripsi rinci."}
        </p>
      ),
    },
    {
      key: "candidates",
      header: "Kandidat",
      cell: (row: ElectionListItem) => (
        <Badge variant="info">{row._count?.candidates || 0} Kandidat</Badge>
      ),
      className: "text-center",
    },
    {
      key: "createdAt",
      header: "Tanggal Dibuat",
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
      icon: <Eye className="w-4 h-4" />,
      onClick: (row: ElectionListItem) => {
        toast.info(`Membuka detail: ${row.title}`);
      },
    },
    {
      label: "Kelola Kandidat",
      icon: <Layers className="w-4 h-4" />,
      onClick: (row: ElectionListItem) => {
        toast.info(`Kelola kandidat: ${row.title}`);
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Admin Hero Card */}
      <div className="bg-card rounded-3xl border border-border shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">
              Panel Kontrol
            </p>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Dashboard Admin
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Selamat datang, <strong>{displayName}</strong>. Anda mengelola
              pemilihan yang ditugaskan oleh Super Admin.
            </p>
          </div>
        </div>
      </div>

      {/* Assigned Elections Table */}
      <div className="bg-card rounded-3xl border border-border shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-border">
          <div>
            <h2 className="font-sans text-xl font-bold text-card-foreground">
              Pemilihan yang Ditugaskan ({elections.length})
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Daftar pemilihan yang berada dalam cakupan tanggung jawab
              administratif Anda.
            </p>
          </div>
        </div>

        <DataTable<ElectionListItem>
          data={elections}
          columns={columns}
          rowOptions={rowOptions}
          isLoading={isLoading}
          emptyTitle="Belum Ada Penugasan Pemilihan"
          emptyDescription="Super Admin belum menugaskan pemilihan kepada akun Anda. Hubungi Super Administrator untuk penugasan scope election."
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
