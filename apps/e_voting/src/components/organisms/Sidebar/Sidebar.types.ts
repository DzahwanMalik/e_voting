import type { ComponentType, SVGProps } from "react";

interface SidebarNavItem {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  href: string;
}

interface SidebarProps {
  roleName: string;
  displayName: string;
  onLogout: () => void;
  isLoggingOut?: boolean;
}

export type { SidebarNavItem, SidebarProps };
