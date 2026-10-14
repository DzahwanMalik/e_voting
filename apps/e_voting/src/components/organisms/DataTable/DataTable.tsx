import { MoreHorizontal, Search } from "lucide-react";
import Input from "@/components/atoms/Input";
import Pagination from "@/components/molecules/Pagination";
import DropdownMenu from "@/components/molecules/DropdownMenu";
import LoadingState from "@/components/molecules/LoadingState";
import EmptyState from "@/components/molecules/EmptyState";
import type { DataTableProps } from "./DataTable.types";

const DataTable = <T,>({
  data,
  columns,
  rowOptions,
  rowKey = "id" as keyof T,
  isLoading = false,
  loadingMessage = "Memuat data...",
  emptyTitle = "Tidak Ada Data",
  emptyDescription = "Tidak ada data untuk ditampilkan saat ini.",
  searchProps,
  paginationProps,
  className = "",
  ...props
}: DataTableProps<T>) => {
  const getKey = (row: T, index: number): string => {
    if (typeof rowKey === "function") return String(rowKey(row));
    const val = row[rowKey];
    return val != null ? String(val) : String(index);
  };

  const hasSearch = Boolean(searchProps);

  const renderSearchToolbar = () => {
    if (!hasSearch) return null;

    return (
      <div className="p-3">
        <div className="w-full sm:max-w-sm">
          <Input
            type="search"
            placeholder={searchProps!.placeholder ?? "Cari..."}
            value={searchProps!.value}
            onChange={(e) => searchProps!.onChange(e.target.value)}
            leftElement={<Search className="w-4 h-4" />}
            disabled={searchProps!.isLoading}
            autoFocus
          />
        </div>
      </div>
    );
  };

  const renderPagination = () => {
    if (!paginationProps) return null;

    return (
      <Pagination
        currentPage={paginationProps.currentPage}
        totalPages={paginationProps.totalPages}
        onPageChange={paginationProps.onPageChange}
        isLoading={paginationProps.isLoading ?? isLoading}
        className="mt-4 pt-4 border-t border-border"
      />
    );
  };

  const renderOptionsMenu = (row: T) => {
    if (!rowOptions || rowOptions.length === 0) return null;

    const options = rowOptions.map((opt) => ({
      label: opt.label,
      icon: opt.icon,
      onClick: () => opt.onClick(row),
      isDestructive: opt.isDestructive ?? false,
      disabled: opt.disabled ? opt.disabled(row) : false,
    }));

    return (
      <DropdownMenu
        options={options}
        triggerIcon={<MoreHorizontal className="w-4 h-4" />}
        triggerLabel="Pilih aksi"
      />
    );
  };

  const colSpan =
    columns.length + (rowOptions && rowOptions.length > 0 ? 1 : 0);

  return (
    <>
      <div
        className={`bg-card rounded-2xl border border-border overflow-x-auto ${className}`.trim()}
        {...props}
      >
        {renderSearchToolbar()}
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left font-sans font-semibold text-xs text-muted-foreground uppercase tracking-wider px-4 py-3 border-b border-border whitespace-nowrap ${
                    col.headerClassName ?? ""
                  }`}
                >
                  {col.header}
                </th>
              ))}
              {rowOptions && rowOptions.length > 0 && (
                <th className="w-10 px-4 py-3 text-right" />
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={colSpan} className="py-8">
                  <LoadingState message={loadingMessage} textSize="md" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="py-8">
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                  />
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={getKey(row, index)}
                  className="border-b border-border last:border-0"
                >
                  {columns.map((col) => (
                    <td
                      key={`${getKey(row, index)}-${col.key}`}
                      className={`px-4 py-3 text-foreground align-top ${col.className ?? ""}`}
                    >
                      {col.cell(row)}
                    </td>
                  ))}
                  {rowOptions && rowOptions.length > 0 && (
                    <td className="px-2 py-3 text-right">
                      {renderOptionsMenu(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {renderPagination()}
    </>
  );
};

export default DataTable;
