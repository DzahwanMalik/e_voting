import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  roleName: string;
  displayName: string;
  onLogout: () => void;
  isLoggingOut?: boolean;
}

export type { DashboardLayoutProps };
