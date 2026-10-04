import { useState, useEffect } from "react";
import {
  Shield,
  Users,
  CheckCircle,
  BarChart3,
  AlertCircle,
  Calendar,
  Layers,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import {
  getElectionsApi,
  type ElectionListItem,
} from "@/services/election.service";
import type { SuperAdminDashboardProps } from "./SuperAdminDashboard.types";

const SuperAdminDashboard = ({ displayName }: SuperAdminDashboardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [elections, setElections] = useState<ElectionListItem[]>([]);
  const [error, setError] = useState<string | null>(null);

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
          setError(message);
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

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getElectionsApi();
      setElections(data);
      toast.success("Seluruh data pemilihan berhasil diperbarui.");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Gagal memuat daftar seluruh pemilihan.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const totalCandidates = elections.reduce(
    (sum, e) => sum + (e._count?.candidates || 0),
    0,
  );

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
              Selamat datang, <strong>{displayName}</strong>. Anda memegang hak akses penuh terhadap seluruh ekosistem E-Voting.
            </p>
          </div>
          <div>
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
              <span>Akses penuh sistem, kelola seluruh pemilihan &amp; buat election baru (BR-03, BR-04).</span>
            </div>
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-muted border border-border">
              <Users className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>Penugasan Admin (assignment) &amp; manajemen Voter di semua election (BR-06).</span>
            </div>
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-muted border border-border">
              <BarChart3 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>Melihat hasil perolehan suara (Result) setiap kandidat &amp; agregasi (BR-12).</span>
            </div>
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-muted border border-border">
              <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>Kelola kandidat pada seluruh pemilihan yang terdaftar di database.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} isLoading={isLoading}>
            Coba Lagi
          </Button>
        </div>
      )}

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

      {/* All System Elections List */}
      <div className="bg-card rounded-3xl border border-border shadow-sm p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h2 className="font-sans text-xl font-bold text-card-foreground">
              Seluruh Pemilihan Sistem ({elections.length})
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Daftar seluruh pemilihan di dalam sistem yang dikelola secara terpusat.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center space-y-2">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Memuat data pemilihan...</p>
          </div>
        ) : elections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {elections.map((elec) => (
              <div
                key={elec.id}
                className="p-5 rounded-2xl bg-muted border border-border hover:border-border-hover transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-sans font-bold text-base text-card-foreground">
                    {elec.title}
                  </h3>
                  <Badge variant="info">
                    {elec._count?.candidates || 0} Kandidat
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {elec.description || "Tidak ada deskripsi rinci."}
                </p>
                <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(elec.createdAt)}</span>
                  </div>
                  <Badge variant="secondary">ID: #{elec.id}</Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
              <Layers className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-card-foreground">
              Belum Ada Pemilihan Dibuat
            </p>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Sistem belum memiliki data pemilihan. Anda dapat membuat pemilihan baru sebagai Super Administrator.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
