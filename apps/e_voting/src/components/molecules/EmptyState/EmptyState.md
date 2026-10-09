# EmptyState

- **Level**: Molecule
- **Folder**: `src/components/molecules/EmptyState/`

## Purpose

Reusable empty state component displayed when no data is available (e.g., no elections assigned, no elections created). Replaces duplicated inline empty-state markup across dashboard organisms.

## Props

- `title`: `string` (optional) — Heading text. Defaults to `"Tidak Ada Data"`.
- `description`: `string` (optional) — Description text. Defaults to a generic message.
- `icon`: `ReactNode` (optional) — Custom icon. Defaults to `<Layers />` from Lucide.

## Semantic Tokens Used

- `bg-card`, `border-border`, `text-card-foreground`, `shadow-sm`, `rounded-3xl` — card surface
- `bg-muted`, `text-muted-foreground` — icon container
- `text-sm`, `text-muted-foreground` — description text

## Code Example

```tsx
import EmptyState from "@/components/molecules/EmptyState";

<EmptyState
  title="Belum Ada Pemilihan Aktif"
  description="Akun Anda belum terdaftar dalam pemilihan aktif manapun."
/>
```

