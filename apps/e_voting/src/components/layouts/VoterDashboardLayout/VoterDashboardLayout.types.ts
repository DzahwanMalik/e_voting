import type { ReactNode } from "react";

interface VoterDashboardLayoutProps {
  children: ReactNode;
  roleName: string;
  displayName: string;
  onLogout: () => void;
  isLoggingOut?: boolean;
}

export type { VoterDashboardLayoutProps };
