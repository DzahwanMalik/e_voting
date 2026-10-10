# DataTable Component

- **Level**: Organism
- **Folder**: `src/components/organisms/DataTable/`

## Purpose

Generic, reusable table component for displaying fetched data passed via props. Supports column-based rendering, per-row action options menu (using `DropdownMenu` molecule), and loading/empty states. Designed for admin section use (Admin & Super Admin) to simplify Developer Experience.

## Props

- `data`: `T[]` — the fetched data array to render
- `columns`: `DataTableColumn<T>[]` — column definitions with render functions
- `rowOptions`: `DataTableRowOption<T>[]` (optional) — per-row actions rendered in the options column
- `rowKey`: `keyof T | ((row: T) => string | number)` (optional, default `"id"`) — unique key extractor
- `isLoading`: `boolean` (optional) — shows `LoadingState` when true
- `emptyTitle`: `string` (optional) — title shown when data is empty
- `emptyDescription`: `string` (optional) — description shown when data is empty
- `searchProps`: `DataTableSearchProps` (optional) — enables search Input in the toolbar with `leftElement={<Search />}`
- `paginationProps`: `DataTablePaginationProps` (optional) — enables the `Pagination` molecule in the toolbar

### DataTableSearchProps

- `value`: `string` — controlled search input value
- `onChange`: `(value: string) => void` — called on input change (consumer handles debouncing)
- `placeholder`: `string` (optional, default `"Cari..."`)
- `isLoading`: `boolean` (optional) — disables the search input during async requests

### DataTablePaginationProps

- `currentPage`: `number` — current 1-indexed page
- `totalPages`: `number` — total number of pages
- `onPageChange`: `(page: number) => void` — callback when a page button is clicked
- `meta`: `PaginationMeta` (optional) — provides `total`/`limit` for the "Menampilkan X–Y dari Z" summary
- `isLoading`: `boolean` (optional) — disables pagination buttons during async requests
- `className`: `string` (optional) — container class

### DataTableColumn\<T\>

- `key`: `string`
- `header`: `string`
- `cell`: `(row: T) => ReactNode`
- `className`: `string` (optional — cell alignment, e.g. `text-center`)
- `headerClassName`: `string` (optional)

### DataTableRowOption\<T\>

- `label`: `string`
- `icon`: `ReactNode` (optional)
- `onClick`: `(row: T) => void`
- `isDestructive`: `boolean` (optional)
- `disabled`: `(row: T) => boolean` (optional)

## Semantic Tokens Used

- Container: `bg-card`, `border-border`, `rounded-2xl`, `shadow-sm`
- Table header: `text-muted-foreground`, `border-border`
- Table rows: `border-border`, `hover:bg-accent` (group hover)
- Loading/Empty: composes `LoadingState` and `EmptyState` molecules

## Code Example

```tsx
import DataTable from "@/components/organisms/DataTable";
import type { ElectionListItem } from "@/services/election.service";

const columns = [
  {
    key: "title",
    header: "Judul",
    cell: (row) => row.title,
  },
  {
    key: "description",
    header: "Deskripsi",
    cell: (row) => row.description || "-",
  },
  {
    key: "candidates",
    header: "Kandidat",
    cell: (row) => row._count?.candidates || 0,
    className: "text-center",
  },
  {
    key: "createdAt",
    header: "Dibuat",
    cell: (row) => formatDate(row.createdAt),
  },
];

const rowOptions = [
  {
    label: "Lihat Detail",
    icon: <Eye className="w-4 h-4" />,
    onClick: (election: ElectionListItem) => onViewElection(election.id),
  },
  {
    label: "Hapus",
    icon: <Trash2 className="w-4 h-4" />,
    onClick: (election: ElectionListItem) => onDeleteElection(election.id),
    isDestructive: true,
  },
];

<DataTable<ElectionListItem>
  data={elections}
  columns={columns}
  rowOptions={rowOptions}
  isLoading={isLoading}
/>
```

#### With Search & Pagination (DataTable with Pagination)

```tsx
import { useState, useEffect } from "react";
import { toast } from "sonner";
import DataTable from "@/components/organisms/DataTable";
import { useDebounce } from "@/hooks/useDebounce";
import { getVotersApi, type VoterListItem } from "@/services/voter.service";

const VoterManagement = () => {
  const [voters, setVoters] = useState<VoterListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ total: 0, totalPages: 0, page: 1, limit: 10 });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    const loadVoters = async () => {
      setIsLoading(true);
      try {
        const { voters: data, meta: paginationMeta } = await getVotersApi({
          search: debouncedSearch,
          page: currentPage,
        });
        setVoters(data);
        setMeta(paginationMeta);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Gagal memuat data.");
      } finally {
        setIsLoading(false);
      }
    };
    void loadVoters();
  }, [debouncedSearch, currentPage]);

  const columns = [
    { key: "username", header: "Username", cell: (row) => row.username },
    { key: "name", header: "Nama", cell: (row) => row.name },
    { key: "createdAt", header: "Dibuat", cell: (row) => formatDate(row.createdAt) },
  ];

  return (
    <DataTable<VoterListItem>
      data={voters}
      columns={columns}
      isLoading={isLoading}
      searchProps={{
        value: searchQuery,
        onChange: setSearchQuery,
        placeholder: "Cari pemilih...",
        isLoading,
      }}
      paginationProps={{
        currentPage: meta.page,
        totalPages: meta.totalPages,
        onPageChange: setCurrentPage,
        meta,
        isLoading,
      }}
    />
  );
};
```

