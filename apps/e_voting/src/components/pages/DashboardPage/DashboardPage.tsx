import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Vote, LogOut, CheckCircle, Shield, Users, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { useUserStore } from "@/stores/useUserStore";
import { logoutApi } from "@/services/auth.service";

export const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Reactive state from Zustand store
  const user = useUserStore((state) => state.user);
  const isSuperAdmin = useUserStore((state) => state.isSuperAdmin());
  const isVoter = useUserStore((state) => state.isVoter());

  const isVoterRoute = location.pathname.startsWith("/voter");
  const displayRole = isSuperAdmin
    ? "Super Admin"
    : isVoter || isVoterRoute
    ? "Voter"
    : "Admin";

  const displayUsername = user?.username || (isVoterRoute ? "voter" : "admin");
  const displayName = user?.name || displayUsername;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutApi();
      toast.success("Berhasil keluar dari sistem.");
      navigate("/login");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal melakukan logout.";
      toast.error(message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navbar */}
      <header className="bg-card border-b border-border sticky top-0 z-20 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
            <Vote className="w-5 h-5" />
          </div>
          <div>
            <span className="font-heading font-bold text-lg text-foreground tracking-tight">
              E-Voting
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs text-muted-foreground font-sans">
              MVP v0.1.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant={
              displayRole === "Super Admin"
                ? "info"
                : displayRole === "Admin"
                ? "warning"
                : "success"
            }
          >
            {displayRole}
          </Badge>
          <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
            {displayName}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            isLoading={isLoggingOut}
            icon={<LogOut className="w-4 h-4" />}
          >
            Keluar
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Welcome Hero Card */}
        <div className="bg-card rounded-3xl border border-border shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">
                Panel Kontrol
              </p>
              <h1 className="font-sans text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Dashboard {displayRole}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Selamat datang, <strong>{displayName}</strong>. Anda masuk dengan cakupan peran <strong>{displayRole}</strong>.
              </p>
            </div>
            <div>
              <Badge
                variant={
                  displayRole === "Super Admin"
                    ? "info"
                    : displayRole === "Admin"
                    ? "warning"
                    : "success"
                }
              >
                Akses Terverifikasi
              </Badge>
            </div>
          </div>

          {/* Role Capabilities Summary based on PRD */}
          <div className="mt-6 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Hak Akses &amp; Cakupan Peran (PRD MVP)
            </h2>

            {displayRole === "Super Admin" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-muted border border-border">
                  <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Akses penuh sistem, kelola seluruh pemilihan &amp; buat election baru.</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-muted border border-border">
                  <Users className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Penugasan Admin (assignment) &amp; manajemen Voter di semua election.</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-muted border border-border">
                  <BarChart3 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Melihat hasil penghitungan suara (Result) pemilihan.</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-muted border border-border">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Kelola kandidat pada seluruh pemilihan yang terdaftar.</span>
                </div>
              </div>
            )}

            {displayRole === "Admin" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-muted border border-border">
                  <Shield className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  <span>Mengelola hanya election yang ditugaskan oleh Super Admin.</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-muted border border-border">
                  <Users className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  <span>Membuat Voter dengan cakupan terbatas pada election tanggung jawabnya.</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-muted border border-border">
                  <CheckCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  <span>Kelola kandidat pada pemilihan yang diberikan.</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-muted border border-border opacity-75">
                  <BarChart3 className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span>Tidak memiliki hak akses melihat hasil voting (Result restricted).</span>
                </div>
              </div>
            )}

            {displayRole === "Voter" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-muted border border-border">
                  <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span>Melihat daftar pemilihan aktif yang memenuhi syarat (eligible).</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-muted border border-border">
                  <Users className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span>Melihat profil dan visi misi para kandidat pemilihan.</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-muted border border-border">
                  <Vote className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span>Memberikan 1 suara per pemilihan (One-Vote-Per-Election).</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-muted border border-border">
                  <Shield className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span>Melihat status keikutsertaan voting Anda (hasVoted status).</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
