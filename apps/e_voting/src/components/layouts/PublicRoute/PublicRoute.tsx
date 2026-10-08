import { Navigate, Outlet } from "react-router";
import { useUserStore } from "@/stores/useUserStore";
import { getAuthToken } from "@/services/auth.service";

const PublicRoute = () => {
  const token = getAuthToken();
  const user = useUserStore((state) => state.user);

  // Jika sudah terautentikasi, alihkan langsung ke halaman yang sesuai
  if (token && user) {
    if (user.role === "VOTER") {
      return <Navigate to="/voter/dashboard" replace />;
    }
    return <Navigate to="/admin/elections" replace />;
  }

  // Jika belum login, izinkan render rute publik (form login)
  return <Outlet />;
};

export default PublicRoute;
