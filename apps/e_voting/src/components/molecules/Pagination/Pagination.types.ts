interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  isLoading?: boolean;
  className?: string;
}

export type { PaginationProps };
