import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { toast } from "sonner";
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import { useUserStore } from "@/stores/useUserStore";
import { logoutApi } from "@/services/auth.service";

const AdminShellPage = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const user = useUserStore((state) => state.user);
  const isSuperAdmin = useUserStore((state) => state.isSuperAdmin());

  const roleName = isSuperAdmin ? "Super Admin" : "Admin";
  const displayName = user?.name || user?.username || "admin";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutApi();
      toast.success("Berhasil keluar dari sistem.");
      navigate("/login");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal melakukan logout.";
      toast.error(message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <AdminDashboardLayout
      roleName={roleName}
      displayName={displayName}
      onLogout={handleLogout}
      isLoggingOut={isLoggingOut}
      isSuperAdmin={isSuperAdmin}
    >
      <Outlet />
    </AdminDashboardLayout>
  );
};

export default AdminShellPage;

