import { MoreHorizontal } from "lucide-react";
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
  emptyTitle = "Tidak Ada Data",
  emptyDescription = "Tidak ada data untuk ditampilkan saat ini.",
  className = "",
  ...props
}: DataTableProps<T>) => {
  const getKey = (row: T, index: number): string => {
    if (typeof rowKey === "function") return String(rowKey(row));
    const val = row[rowKey];
    return val != null ? String(val) : String(index);
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

  if (isLoading) {
    return (
      <div
        className={`bg-card rounded-2xl border border-border p-6 ${className}`.trim()}
        {...props}
      >
        <LoadingState message="Memuat data..." />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className={`bg-card rounded-2xl border border-border p-6 ${className}`.trim()}
        {...props}
      >
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div
      className={`bg-card rounded-2xl border border-border overflow-x-auto ${className}`.trim()}
      {...props}
    >
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
              <th className="border-b border-border" />
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={getKey(row, index)}
              className="border-b border-border last:border-0"
            >
              {columns.map((col) => (
                <td
                  key={`${getKey(row, index)}-${col.key}`}
                  className={`px-4 py-3 text-foreground align-center ${col.className ?? ""}`}
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

