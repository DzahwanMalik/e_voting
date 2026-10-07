import { useUserStore } from "@/stores/useUserStore";
import { AdminDashboard } from "@/components/organisms/AdminDashboard";
import { SuperAdminDashboard } from "@/components/organisms/SuperAdminDashboard";

const AdminDashboardPage = () => {
  const user = useUserStore((state) => state.user);
  const isSuperAdmin = useUserStore((state) => state.isSuperAdmin());

  const displayName = user?.name || user?.username || "admin";

  return isSuperAdmin ? (
    <SuperAdminDashboard displayName={displayName} />
  ) : (
    <AdminDashboard displayName={displayName} />
  );
};

export default AdminDashboardPage;
