import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";

interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
  isActive?: boolean;
  count?: number;
  icon?: ReactNode;
}

export type { TabProps };
