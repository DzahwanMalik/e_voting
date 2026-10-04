import { Navigate, Outlet } from "react-router";
import { useUserStore } from "@/stores/useUserStore";
import { getAuthToken } from "@/services/auth.service";
import type { ProtectedRouteProps } from "./ProtectedRoute.types";

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const token = getAuthToken();
  const { user } = useUserStore();

  // 1. Jika belum login atau token tidak ada, arahkan ke login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Jika ada pembatasan peran dan peran user tidak diizinkan
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Voter yang mengakses area admin dialihkan ke voter dashboard
    if (user.role === "VOTER") {
      return <Navigate to="/voter/dashboard" replace />;
    }
    // Admin yang mengakses area voter dialihkan ke admin dashboard
    return <Navigate to="/admin/dashboard" replace />;
  }

  // 3. Izin sah: render rute anak
  return <Outlet />;
};
