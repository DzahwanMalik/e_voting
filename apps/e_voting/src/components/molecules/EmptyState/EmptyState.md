# EmptyState

- **Level**: Molecule
- **Folder**: `src/components/molecules/EmptyState/`

## Purpose

Reusable empty state component displayed when no data is available (e.g., no elections assigned, no elections created). Follows the same principle as `<LoadingState>` — a pure content molecule without its own card shell. Does not require a `SectionCard` wrapper; renders as a centered content block within its parent container.

## Props

- `title`: `string` (optional) — Heading text. Defaults to `"Tidak Ada Data"`.
- `description`: `string` (optional) — Description text. Defaults to a generic message.
- `icon`: `ReactNode` (optional) — Custom icon. Defaults to `<Layers />` from Lucide.

## Semantic Tokens Used

- `bg-muted`, `text-muted-foreground` — icon container
- `text-card-foreground` — title text
- `text-sm`, `text-muted-foreground` — description text

## Code Example

```tsx
import EmptyState from "@/components/molecules/EmptyState";

<EmptyState
  title="Belum Ada Pemilihan Aktif"
  description="Akun Anda belum terdaftar dalam pemilihan aktif manapun."
/>

{/* Inline usage inside a table container */}
<EmptyState
  title="Tidak Ada Admin"
  description="Tidak ada admin yang cocok dengan pencarian Anda."
  icon={<Search className="w-8 h-8" />}
/>
```

