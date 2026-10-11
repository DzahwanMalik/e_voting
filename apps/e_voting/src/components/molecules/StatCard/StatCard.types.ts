import type { ReactNode } from "react";

type StatCardVariant = "secondary" | "info" | "warning";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  variant?: StatCardVariant;
}

export type { StatCardProps, StatCardVariant };
