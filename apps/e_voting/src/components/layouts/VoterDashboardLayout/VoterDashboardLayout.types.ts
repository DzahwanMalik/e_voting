import type { ReactNode } from "react";

interface VoterDashboardLayoutProps {
  children: ReactNode;
  displayName: string;
  onLogout: () => void;
  isLoggingOut?: boolean;
}

export type { VoterDashboardLayoutProps };
