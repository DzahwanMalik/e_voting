# LoadingState

- **Level**: Molecule
- **Folder**: `src/components/molecules/LoadingState/`

## Purpose

Reusable loading state component displaying a spinning indicator with an optional message. Used across dashboard organisms (VoterDashboard, AdminDashboard, SuperAdminDashboard) to replace duplicated inline spinner markup.

## Props

- `message`: `string` (optional) — Loading description text. Defaults to `"Memuat..."`.
- `spinnerSize`: `"sm" | "md" | "lg"` (optional) — Spinner diameter and border width. Defaults to `"md"`.

## Semantic Tokens Used

- `border-primary` — spinner track color
- `border-t-transparent` — creates the spin animation gap
- `text-muted-foreground` — message text

## Code Example

```tsx
import { LoadingState } from "@/components/molecules/LoadingState";

// Simple usage (inside a card)
<LoadingState message="Memuat daftar pemilihan..." />

// With large spinner
<LoadingState message="Memuat data Anda..." spinnerSize="lg" />
```
