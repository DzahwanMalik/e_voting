import { useState } from "react";
import { NavLink } from "react-router";
import {
  Layers,
  Award,
  Users,
  Shield,
  Settings,
  Vote,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Button from "@/components/atoms/Button";
import type { SidebarNavItem, SidebarProps } from "./Sidebar.types";

const sidebarNavItems: SidebarNavItem[] = [
  {
    label: "Pemilihan",
    icon: Layers,
    href: "/admin/elections",
  },
  {
    label: "Paslon",
    icon: Award,
    href: "/admin/candidate-pairs",
  },
  {
    label: "Pemilih",
    icon: Users,
    href: "/admin/voters",
  },
  {
    label: "Admin",
    icon: Shield,
    href: "/admin/admins",
  },
  {
    label: "Pengaturan",
    icon: Settings,
    href: "/admin/settings",
  },
];

interface SidebarContentProps {
  roleName: string;
  displayName: string;
  onLogout: () => void;
  isLoggingOut: boolean;
  onNavClick?: () => void;
  onClose?: () => void;
}

const SidebarContent = ({
  roleName,
  displayName,
  onLogout,
  isLoggingOut,
  onNavClick,
  onClose,
}: SidebarContentProps) => {
  return (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
            <Vote className="w-5 h-5" />
          </div>
          <div>
            <span className="font-heading font-bold text-lg text-foreground tracking-tight">
              E-Voting
            </span>
            <span className="block text-xs text-muted-foreground mt-0.5">
              MVP v0.1.0
            </span>
          </div>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="md:hidden -mr-2"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        <ul className="space-y-1">
          {sidebarNavItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.href}
                onClick={onNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User info + Logout */}
      <div className="p-4 sm:p-6 border-t border-border mt-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground font-medium text-sm">
            {displayName.charAt(0) || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-foreground truncate">
              {displayName}
            </p>
            <p className="text-xs text-muted-foreground truncate">{roleName}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={onLogout}
          isLoading={isLoggingOut}
          icon={<LogOut className="w-4 h-4" />}
        >
          Keluar
        </Button>
      </div>
    </div>
  );
};

const Sidebar = ({
  roleName,
  displayName,
  onLogout,
  isLoggingOut = false,
}: SidebarProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleNavClick = () => setIsMobileOpen(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:bg-card md:border-r md:border-border md:fixed md:inset-y-0 md:overflow-y-auto">
        <SidebarContent
          roleName={roleName}
          displayName={displayName}
          onLogout={onLogout}
          isLoggingOut={isLoggingOut}
          onNavClick={handleNavClick}
        />
      </aside>

      {/* Mobile header + hamburger */}
      <header className="md:hidden flex items-center justify-between px-4 py-3.5 border-b border-border bg-card sticky top-0 z-30 w-full shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
            <Vote className="w-5 h-5" />
          </div>
          <div>
            <span className="font-heading font-bold text-lg text-foreground tracking-tight">
              E-Voting
            </span>
            <span className="block text-xs text-muted-foreground -mt-0.5">
              MVP v0.1.0
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileOpen(true)}
          icon={<Menu className="w-4 h-4" />}
        >
          Menu
        </Button>
      </header>

      {/* Mobile overlay sidebar */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-200 ${
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
        <div
          className={`absolute inset-y-0 left-0 w-64 bg-card border-r border-border shadow-xl transform transition-transform duration-200 flex flex-col h-full ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent
            roleName={roleName}
            displayName={displayName}
            onLogout={onLogout}
            isLoggingOut={isLoggingOut}
            onNavClick={handleNavClick}
            onClose={() => setIsMobileOpen(false)}
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;

