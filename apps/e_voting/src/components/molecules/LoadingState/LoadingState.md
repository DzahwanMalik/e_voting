# LoadingState

- **Level**: Molecule
- **Folder**: `src/components/molecules/LoadingState/`

## Purpose

Reusable loading state component displaying a text ellipsis pulse animation ("Memuat" → "Memuat." → "Memuat.." → "Memuat..."). Used across page organisms and modal bodies to replace duplicated inline loading markup.

## Props

- `message`: `string` (optional) — Loading description text (without trailing dots). Defaults to `"Memuat"`.
- `textSize`: `"sm" \| "md" \| "lg"` (optional) — Text size variant. Defaults to `"md"`.

## Semantic Tokens Used

- `text-muted-foreground` — loading text color

## Code Example

```tsx
import LoadingState from "@/components/molecules/LoadingState";

// Simple usage
<LoadingState message="Memuat daftar pemilihan..." textSize="lg" />
```

