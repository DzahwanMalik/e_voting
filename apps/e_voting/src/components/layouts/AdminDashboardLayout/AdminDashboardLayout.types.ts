import type { ReactNode } from "react";

interface AdminDashboardLayoutProps {
  children: ReactNode;
  roleName: string;
  displayName: string;
  onLogout: () => void;
  isLoggingOut?: boolean;
  isSuperAdmin?: boolean;
}

export type { AdminDashboardLayoutProps };
