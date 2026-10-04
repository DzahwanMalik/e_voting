import { useState, useEffect } from "react";
import {
  Shield,
  Users,
  CheckCircle,
  BarChart3,
  AlertCircle,
  Calendar,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import {
  getElectionsApi,
  type ElectionListItem,
} from "@/services/election.service";
import type { AdminDashboardProps } from "./AdminDashboard.types";

const AdminDashboard = ({ displayName }: AdminDashboardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [elections, setElections] = useState<ElectionListItem[]>([]);
  const [error, setError] = useState<string | null>(null);

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
          setError(message);
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

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getElectionsApi();
      setElections(data);
      toast.success("Data pemilihan berhasil diperbarui.");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Gagal memuat pemilihan yang ditugaskan.";
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

  return (
    <div className="space-y-6">
      {/* Admin Hero Card */}
      <div className="bg-card rounded-3xl border border-border shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">
              Panel Kontrol Administrator
            </p>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Dashboard Admin
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Selamat datang, <strong>{displayName}</strong>. Anda mengelola pemilihan yang ditugaskan oleh Super Admin.
            </p>
          </div>
          <div>
            <Badge variant="warning">Akses Terverifikasi (Admin)</Badge>
          </div>
        </div>

        {/* Role Capabilities Summary based on PRD */}
        <div className="mt-6 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Hak Akses &amp; Cakupan Peran (PRD MVP)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-muted border border-border">
              <Shield className="w-4 h-4 text-warning shrink-0 mt-0.5" />
              <span>Mengelola hanya pemilihan yang ditugaskan oleh Super Admin.</span>
            </div>
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-muted border border-border">
              <Users className="w-4 h-4 text-warning shrink-0 mt-0.5" />
              <span>Membuat Voter dengan cakupan terbatas pada pemilihan tanggung jawabnya.</span>
            </div>
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-muted border border-border">
              <CheckCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
              <span>Kelola kandidat pada pemilihan yang diberikan.</span>
            </div>
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-muted border border-border opacity-75">
              <BarChart3 className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <span>Tidak memiliki akses melihat hasil voting (Result restricted - BR-12).</span>
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

      {/* Assigned Elections List */}
      <div className="bg-card rounded-3xl border border-border shadow-sm p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h2 className="font-sans text-xl font-bold text-card-foreground">
              Pemilihan yang Ditugaskan ({elections.length})
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Daftar pemilihan yang berada dalam cakupan tanggung jawab administratif Anda.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center space-y-2">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Memuat daftar pemilihan...</p>
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
                  <Badge variant="warning">
                    {elec._count?.candidates || 0} Kandidat
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {elec.description || "Tidak ada deskripsi rinci."}
                </p>
                <div className="pt-2 border-t border-border flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Dibuat: {formatDate(elec.createdAt)}</span>
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
              Belum Ada Penugasan Pemilihan
            </p>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Super Admin belum menugaskan pemilihan kepada akun Anda. Hubungi Super Administrator untuk penugasan scope election.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
