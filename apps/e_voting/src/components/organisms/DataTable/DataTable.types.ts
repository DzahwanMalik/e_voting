import type { HTMLAttributes, ReactNode } from "react";
import type { PaginationMeta } from "@/types/pagination";

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

interface DataTableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

interface DataTablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  meta?: PaginationMeta;
  isLoading?: boolean;
}

interface DataTableProps<T> extends HTMLAttributes<HTMLDivElement> {
  data: T[];
  columns: DataTableColumn<T>[];
  rowOptions?: DataTableRowOption<T>[];
  rowKey?: keyof T | ((row: T) => string | number);
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  searchProps?: DataTableSearchProps;
  paginationProps?: DataTablePaginationProps;
}

export type {
  DataTableColumn,
  DataTableRowOption,
  DataTableSearchProps,
  DataTablePaginationProps,
  DataTableProps,
};
