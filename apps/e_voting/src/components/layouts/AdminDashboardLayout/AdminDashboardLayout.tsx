import Sidebar from "@/components/organisms/Sidebar";
import type { AdminDashboardLayoutProps } from "./AdminDashboardLayout.types";

const AdminDashboardLayout = ({
  children,
  roleName,
  displayName,
  onLogout,
  isLoggingOut = false,
}: AdminDashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans">
      {/* Sidebar handles its own desktop/mobile rendering */}
      <Sidebar
        roleName={roleName}
        displayName={displayName}
        onLogout={onLogout}
        isLoggingOut={isLoggingOut}
      />

      {/* Main content — offset by sidebar width on desktop */}
      <main className="flex-1 md:ml-64 min-w-0 w-full">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardLayout;

