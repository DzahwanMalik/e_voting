import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationProps } from "./Pagination.types";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  className = "",
}: PaginationProps) => {
  const getPageNumbers = (): (number | "ellipsis")[] => {
    if (totalPages <= 1) return [];

    const pages: (number | "ellipsis")[] = [];
    const visibleEdge = 1;
    const visibleAround = 1;
    const startRange = Math.max(1, currentPage - visibleAround);
    const endRange = Math.min(totalPages, currentPage + visibleAround);

    if (currentPage <= visibleEdge + visibleAround) {
      for (let i = 1; i <= Math.min(totalPages, 1 + 2 * visibleAround); i++) {
        pages.push(i);
      }
      if (totalPages > 1 + 2 * visibleAround) {
        pages.push("ellipsis");
      }
    } else if (currentPage >= totalPages - visibleEdge - visibleAround) {
      pages.push("ellipsis");
      for (let i = totalPages - 2 * visibleAround; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("ellipsis");
      for (let i = startRange; i <= endRange; i++) {
        pages.push(i);
      }
      pages.push("ellipsis");
      pages.push(totalPages);
    }

    return pages;
  };

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-end gap-4 ${className}`.trim()}
    >
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevious || isLoading}
          className="inline-flex items-center justify-center w-9 h-9 text-sm font-medium text-muted-foreground bg-card border border-border rounded-xl hover:bg-accent hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex items-center justify-center w-9 h-9 text-sm text-muted-foreground"
              >
                …
              </span>
            );
          }

          const isCurrent = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              disabled={isLoading}
              className={`inline-flex items-center justify-center w-9 h-9 text-sm font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background
                ${
                  isCurrent
                    ? "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm"
                    : "text-foreground bg-card border border-border hover:bg-accent"
                }
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext || isLoading}
          className="inline-flex items-center justify-center w-9 h-9 text-sm font-medium text-muted-foreground bg-card border border-border rounded-xl hover:bg-accent hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
