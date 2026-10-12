# Pagination Component

- **Level**: Molecule
- **Folder**: `src/components/molecules/Pagination/`

## Purpose

Reusable pagination control for data tables and list views. Renders "Previous" and "Next" buttons alongside numbered page buttons with ellipsis truncation for large page sets.

## Props

| Prop | Tipe | Default | Deskripsi |
| :--- | :--- | :--- | :--- |
| `currentPage` | `number` | required | Current active page (1-indexed) |
| `totalPages` | `number` | required | Total number of pages available |
| `onPageChange` | `(page: number) => void` | required | Callback fired when a page button is clicked |
| `isLoading` | `boolean` | `false` | Disables all buttons while loading |
| `className` | `string` | `""` | Additional container class |

## Behavior

- **Ellipsis truncation**: When total pages > 7 and the current page is in the middle, ellipsis (`…`) placeholders replace edge page buttons.
- **Boundary awareness**: Previous button disabled on page 1; Next button disabled on last page.
- **Loading state**: All interactive buttons are disabled when `isLoading` is true.
- **Single page**: When `totalPages <= 1`, no page numbers or navigation buttons are rendered.

## Semantic Tokens Used

- Container: `flex flex-col sm:flex-row items-center justify-end`
- Active page button: `bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm`
- Inactive page button: `bg-card border border-border text-foreground hover:bg-accent`
- Previous/Next buttons: `bg-card border border-border text-muted-foreground hover:bg-accent hover:text-foreground`
- Focus ring: `focus:ring-ring focus:ring-offset-2 focus:ring-offset-background`

## Code Example

```tsx
import Pagination from "@/components/molecules/Pagination";

const [currentPage, setCurrentPage] = useState(1);

<Pagination
  currentPage={currentPage}
  totalPages={meta.totalPages}
  onPageChange={setCurrentPage}
  isLoading={isLoading}
/>
```

