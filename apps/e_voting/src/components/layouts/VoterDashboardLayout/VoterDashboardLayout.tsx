import { Vote, LogOut } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import type { VoterDashboardLayoutProps } from "./VoterDashboardLayout.types";

const VoterDashboardLayout = ({
  children,
  roleName,
  displayName,
  onLogout,
  isLoggingOut = false,
}: VoterDashboardLayoutProps) => {
  const badgeVariant =
    roleName === "Super Admin"
      ? "info"
      : roleName === "Admin"
      ? "warning"
      : "success";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-card border-b border-border sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
            <Vote className="w-5 h-5" />
          </div>
          <div>
            <span className="font-heading font-bold text-lg text-foreground tracking-tight">
              E-Voting
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs text-muted-foreground">
              MVP v0.1.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={badgeVariant}>{roleName}</Badge>
          <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
            {displayName}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            isLoading={isLoggingOut}
            icon={<LogOut className="w-4 h-4" />}
          >
            Keluar
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};

export default VoterDashboardLayout;
