import { useState, useEffect } from "react";
import {
  Shield,
  Users,
  CheckCircle,
  BarChart3,
  Calendar,
  Layers,
  Award,
  Eye,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/atoms/Badge";
import { DataTable } from "@/components/organisms/DataTable";
import {
  getElectionsApi,
  type ElectionListItem,
} from "@/services/election.service";
import { formatDate } from "@/lib/utils";
import type { SuperAdminDashboardProps } from "./SuperAdminDashboard.types";

const SuperAdminDashboard = ({ displayName }: SuperAdminDashboardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [elections, setElections] = useState<ElectionListItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    const loadAllElections = async () => {
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
              : "Gagal memuat daftar seluruh pemilihan.";
          toast.error(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadAllElections();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalCandidates = elections.reduce(
    (sum, e) => sum + (e._count?.candidates || 0),
    0,
  );

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
        <Badge variant="info">
          {row._count?.candidates || 0} Kandidat
        </Badge>
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
    {
      label: "Hapus Pemilihan",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (row: ElectionListItem) => {
        toast.info(`Hapus pemilihan: ${row.title}`);
      },
      isDestructive: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Super Admin Hero Card */}
      <div className="bg-card rounded-3xl border border-border shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">
              Pusat Otoritas Tertinggi
            </p>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Dashboard Super Admin
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Selamat datang, <strong>{displayName}</strong>. Anda memegang
              hak akses penuh terhadap seluruh ekosistem E-Voting.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="info">Akses Penuh (Super Admin)</Badge>
          </div>
        </div>

        {/* Role Capabilities Summary based on PRD */}
        <div className="mt-6 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Hak Akses &amp; Cakupan Peran (PRD MVP)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-muted border border-border">
              <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>
                Akses penuh sistem, kelola seluruh pemilihan &amp; buat election
                baru (BR-03, BR-04).
              </span>
            </div>
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-muted border border-border">
              <Users className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>
                Penugasan Admin (assignment) &amp; manajemen Voter di semua
                election (BR-06).
              </span>
            </div>
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-muted border border-border">
              <BarChart3 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>
                Melihat hasil perolehan suara (Result) setiap kandidat
                &amp; agregasi (BR-12).
              </span>
            </div>
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-muted border border-border">
              <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>
                Kelola kandidat pada seluruh pemilihan yang terdaftar di
                database.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-3xl bg-card border border-border shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              Total Pemilihan Aktif
            </p>
            <p className="font-sans text-2xl font-bold text-card-foreground mt-0.5">
              {elections.length}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary text-primary flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              Total Kandidat Terdaftar
            </p>
            <p className="font-sans text-2xl font-bold text-card-foreground mt-0.5">
              {totalCandidates}
            </p>
          </div>
        </div>
      </div>

      {/* All System Elections Table */}
      <div className="bg-card rounded-3xl border border-border shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h2 className="font-sans text-xl font-bold text-card-foreground">
              Seluruh Pemilihan Sistem ({elections.length})
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Daftar seluruh pemilihan di dalam sistem yang dikelola secara
              terpusat.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              toast.info("Fitur buat pemilihan belum tersedia.");
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-xl hover:bg-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Buat Pemilihan</span>
          </button>
        </div>

        <DataTable<ElectionListItem>
          data={elections}
          columns={columns}
          rowOptions={rowOptions}
          isLoading={isLoading}
          emptyTitle="Belum Ada Pemilihan Dibuat"
          emptyDescription="Sistem belum memiliki data pemilihan. Anda dapat membuat pemilihan baru sebagai Super Administrator."
        />
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
