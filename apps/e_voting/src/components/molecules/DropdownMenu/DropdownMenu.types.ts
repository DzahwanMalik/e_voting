import type { HTMLAttributes, ReactNode } from "react";

interface DropdownOption {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  isDestructive?: boolean;
  disabled?: boolean;
}

interface DropdownMenuProps extends HTMLAttributes<HTMLDivElement> {
  options: DropdownOption[];
  triggerIcon?: ReactNode;
  triggerLabel?: string;
  align?: "start" | "center" | "end";
}

export type { DropdownOption, DropdownMenuProps };
