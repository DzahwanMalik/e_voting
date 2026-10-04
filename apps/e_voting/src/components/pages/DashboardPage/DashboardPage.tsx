import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { VoterDashboard } from "@/components/organisms/VoterDashboard";
import { AdminDashboard } from "@/components/organisms/AdminDashboard";
import { SuperAdminDashboard } from "@/components/organisms/SuperAdminDashboard";
import { useUserStore } from "@/stores/useUserStore";
import { logoutApi } from "@/services/auth.service";

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Authentication & Role State
  const user = useUserStore((state) => state.user);
  const isSuperAdmin = useUserStore((state) => state.isSuperAdmin());
  const isVoter = useUserStore((state) => state.isVoter());

  const isVoterRoute = location.pathname.startsWith("/voter");
  const isVoterUser = isVoter || isVoterRoute;

  const displayRole = isSuperAdmin
    ? "Super Admin"
    : isVoterUser
    ? "Voter"
    : "Admin";

  const displayUsername = user?.username || (isVoterUser ? "voter" : "admin");
  const displayName = user?.name || displayUsername;

  // Logout Handler
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
    <DashboardLayout
      roleName={displayRole}
      displayName={displayName}
      onLogout={handleLogout}
      isLoggingOut={isLoggingOut}
    >
      {isSuperAdmin ? (
        <SuperAdminDashboard displayName={displayName} />
      ) : isVoterUser ? (
        <VoterDashboard displayName={displayName} />
      ) : (
        <AdminDashboard displayName={displayName} />
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;

