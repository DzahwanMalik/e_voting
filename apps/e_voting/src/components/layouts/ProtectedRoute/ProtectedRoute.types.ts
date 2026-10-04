import type { UserRole } from "@/stores/useUserStore";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export type { ProtectedRouteProps };
