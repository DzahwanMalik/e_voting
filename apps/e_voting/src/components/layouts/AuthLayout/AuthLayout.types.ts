import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  badgeText?: string;
}

export type { AuthLayoutProps };
