# Badge Component

- **Level**: Atom
- **Folder**: `src/components/atoms/Badge/`

## Purpose
The `Badge` component displays compact status indicators, pills, and role tags using the semantic color tokens specified in `DESIGN.md`.

## Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'default' \| 'success' \| 'warning' \| 'pending' \| 'info' \| 'secondary'` | `'default'` | Semantic status variant |
| `icon` | `ReactNode` | `undefined` | Optional leading icon |

## Semantic Tokens Used
- Success: `bg-success-subtle`, `text-success-subtle-foreground`
- Warning: `bg-warning-subtle`, `text-warning-subtle-foreground`
- Pending: `bg-pending-subtle`, `text-pending-subtle-foreground`
- Info: `bg-info-subtle`, `text-info-subtle-foreground`
- Secondary: `bg-secondary`, `text-secondary-foreground`
- Radius: `rounded-full`

## Code Example
```tsx
import { Badge } from "@/components/atoms/Badge";
import { ShieldCheck } from "lucide-react";

<Badge variant="secondary" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
  MVP v0.1.0
</Badge>
```
