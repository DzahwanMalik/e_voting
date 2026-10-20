import type { ComponentType, SVGProps } from "react";

interface SidebarNavItem {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  href: string;
  isSuperAdminOnly?: boolean;
}

interface SidebarProps {
  roleName: string;
  displayName: string;
  onLogout: () => void;
  isLoggingOut?: boolean;
  isSuperAdmin?: boolean;
}

export type { SidebarNavItem, SidebarProps };
