import { Navigate, Outlet } from "react-router";
import { useUserStore } from "@/stores/useUserStore";
import { getAuthToken } from "@/services/auth.service";

export const PublicRoute = () => {
  const token = getAuthToken();
  const user = useUserStore((state) => state.user);

  // Jika sudah terautentikasi, alihkan langsung ke dashboard yang sesuai
  if (token && user) {
    if (user.role === "VOTER") {
      return <Navigate to="/voter/dashboard" replace />;
    }
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Jika belum login, izinkan render rute publik (form login)
  return <Outlet />;
};
