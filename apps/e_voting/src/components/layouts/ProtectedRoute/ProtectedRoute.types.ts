import type { UserRole } from "@/stores/useUserStore";

export interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}
