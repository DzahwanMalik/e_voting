import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/atoms/Badge";
import {
  getElectionsApi,
  type ElectionListItem,
} from "@/services/election.service";
import { formatDate } from "@/lib/utils";
import { LoadingState } from "@/components/molecules/LoadingState";
import { EmptyState } from "@/components/molecules/EmptyState";
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

  return (
    <div className="space-y-6">
      {/* Admin Hero Card */}
      <div className="bg-card rounded-3xl border border-border shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
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

      {/* Assigned Elections List */}
      <div className="bg-card rounded-3xl border border-border shadow-sm p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
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

        {isLoading ? (
          <LoadingState message="Memuat daftar pemilihan..." />
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
          <EmptyState
            title="Belum Ada Penugasan Pemilihan"
            description="Super Admin belum menugaskan pemilihan kepada akun Anda. Hubungi Super Administrator untuk penugasan scope election."
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
