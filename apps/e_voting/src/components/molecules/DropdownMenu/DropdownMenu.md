# DropdownMenu Component

- **Level**: Molecule
- **Folder**: `src/components/molecules/DropdownMenu/`

## Purpose

Reusable floating action menu triggered by a button. Renders a list of options each with an `onClick` handler. Composes the `Button` atom as the trigger. The dropdown panel is rendered with `position: fixed` and positioned via `useLayoutEffect` measuring the trigger's `getBoundingClientRect()`, keeping the menu anchored to the trigger using viewport-relative coordinates. Because the panel uses `fixed` positioning, it escapes overflow clipping from ancestors such as `DataTable`'s `overflow-x-auto` container — the panel always renders fully without being cut off. Positioning logic mirrors the `Select` molecule. Provides click-outside-close and Escape-to-close behavior via `useEffect`.

## Props

- `options`: `DropdownOption[]` — menu items to render
- `triggerIcon`: `ReactNode` (optional) — icon shown on trigger button
- `triggerLabel`: `string` (optional) — aria-label for the trigger button
- `align`: `"start" | "center" | "end"` (default `"end"`) — popover alignment
- `className`: `string` (optional) — container class

### DropdownOption

- `label`: `string`
- `icon`: `ReactNode` (optional leading icon)
- `onClick`: `() => void`
- `isDestructive`: `boolean` (optional — uses `text-destructive` color)
- `disabled`: `boolean` (optional)

## Semantic Tokens Used

- Trigger: `Button` ghost variant (uses `bg-accent` hover, `text-foreground`)
- Panel: `fixed`, `z-50`, `min-w-44`, `bg-card`, `border-border`, `rounded-xl`, `shadow-lg`
- Positioning: `useLayoutEffect` measures trigger via `getBoundingClientRect()` and applies viewport-relative `top`/`left` inline styles (flips above when insufficient space below). A throttled (per-frame via `requestAnimationFrame`) scroll/resize listener re-anchors the panel so it stays glued to the trigger even when the page or a nested scrollable container scrolls.
- Items: `text-foreground`, `hover:bg-accent`, `text-muted-foreground`
- Destructive: `text-destructive`, `hover:bg-destructive/10`
- Divider: `border-border`

## Code Example

```tsx
import { MoreHorizontal } from "lucide-react";
import DropdownMenu from "@/components/molecules/DropdownMenu";

const menus = [
  { label: "Edit", onClick: () => console.log("edit") },
  { label: "Delete", onClick: () => console.log("delete"), isDestructive: true },
];

<DropdownMenu options={menus} triggerIcon={<MoreHorizontal className="w-4 h-4" />} />
```

