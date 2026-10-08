import type { HTMLAttributes, ReactNode } from "react";

interface DataTableColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableRowOption<T> {
  label: string;
  icon?: ReactNode;
  onClick: (row: T) => void;
  isDestructive?: boolean;
  disabled?: (row: T) => boolean;
}

interface DataTableProps<T> extends HTMLAttributes<HTMLDivElement> {
  data: T[];
  columns: DataTableColumn<T>[];
  rowOptions?: DataTableRowOption<T>[];
  rowKey?: keyof T | ((row: T) => string | number);
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export type { DataTableColumn, DataTableRowOption, DataTableProps };
