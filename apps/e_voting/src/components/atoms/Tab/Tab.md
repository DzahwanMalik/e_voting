# Tab Component

- **Level**: Atom
- **Folder**: `src/components/atoms/Tab/`

## Purpose
The `Tab` component renders a single pill-shaped toggle button used to filter or switch between views. It is a pure presentational atom: it only renders state and emits clicks — it does not manage the active value itself. Pair it with `TabList` to build a complete pill filter group, or use it standalone for a single toggle.

## Props & Variants
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `isActive` | `boolean` | `false` | Applies the active (selected) pill style and sets `aria-pressed` |
| `count` | `number` | `undefined` | Optional numeric badge rendered on the right (e.g. item count) |
| `icon` | `ReactNode` | `undefined` | Icon element positioned on the left |
| `ref` | `Ref<HTMLButtonElement>` | `undefined` | Forwarded to the underlying native `<button>` (React 19 ref-as-prop) |

All native button attributes (`onClick`, `disabled`, `title`, `aria-*`, etc.) are forwarded to the root `<button>`.

## States
- **Active**: `bg-primary`, `text-primary-foreground`, `border-primary`, `shadow-xs`; count badge uses `bg-primary-foreground/20`, `text-primary-foreground`.
- **Inactive**: `bg-muted`, `text-muted-foreground`, `border-border`; count badge uses `bg-card`, `border-border`.
- **Hover (inactive)**: `hover:bg-accent`, `hover:text-accent-foreground`.

## Semantic Tokens Used
- `bg-primary`, `text-primary-foreground`, `border-primary`, `bg-primary-foreground/20`
- `bg-muted`, `text-muted-foreground`, `border-border`, `hover:bg-accent`, `hover:text-accent-foreground`
- `bg-card`
- Radius: `rounded-full`; Focus: `focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`

## Notes
- The component is an atom, so it has no dependencies on molecules or organisms.
- `aria-pressed` is applied before the spread of `...props`, so consumers may override it if a different semantics is required.
- Because the atom wraps a native `<button>`, the `ref` prop is explicitly typed as `Ref<HTMLButtonElement>` (React 19 ref-as-prop convention).

## Code Example
```tsx
import Tab from "@/components/atoms/Tab";

<Tab isActive={value === "all"} count={12} onClick={() => onChange("all")}>
  Semua
</Tab>
```
