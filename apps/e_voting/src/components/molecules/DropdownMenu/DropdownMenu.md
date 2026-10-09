# DropdownMenu Component

- **Level**: Molecule
- **Folder**: `src/components/molecules/DropdownMenu/`

## Purpose

Reusable floating action menu triggered by a button. Renders a list of options each with an `onClick` handler. Composes the `Button` atom as the trigger. Position is calculated via `useLayoutEffect` after the menu renders, measuring the menu's real dimensions to position it correctly relative to the trigger. Provides click-outside-close and Escape-to-close behavior via `useEffect`.

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
- Panel: `bg-card`, `border-border`, `rounded-xl`, `shadow-lg`
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

