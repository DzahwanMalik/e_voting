import type { ReactNode } from "react";

interface TabListItem<TValue extends string | number> {
  value: TValue;
  label: string;
  count?: number;
  icon?: ReactNode;
}

interface TabListProps<TValue extends string | number> {
  items: TabListItem<TValue>[];
  value: TValue;
  onChange: (value: TValue) => void;
  ariaLabel?: string;
  className?: string;
}

export type { TabListItem, TabListProps };
