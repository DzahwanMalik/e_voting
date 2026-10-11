# StatCard Component

- **Level**: Molecule
- **Folder**: `src/components/molecules/StatCard/`

## Purpose

Reusable stat card molecule that displays an icon, label, and value in a bordered, color-coded container. Used in both `ElectionResultModal` and `ElectionDetailModal` for summary statistics.

## Props

| Prop | Tipe | Default | Deskripsi |
| :--- | :--- | :--- | :--- |
| `icon` | `ReactNode` | required | Icon element (e.g., `<Users className="w-4 h-4" />`) |
| `label` | `string` | required | Stat label (uppercase tracking-wider) |
| `value` | `string \| number` | required | Stat value (large bold text) |
| `variant` | `StatCardVariant` | `"secondary"` | Color scheme: `secondary` \| `info` \| `warning` |

## Variant Mapping

| Variant | Background | Border | Text |
| :--- | :--- | :--- | :--- |
| `secondary` | `bg-secondary/30` | `border-secondary/50` | `text-secondary-foreground` |
| `info` | `bg-info-subtle/30` | `border-info-subtle/50` | `text-info-subtle-foreground` |
| `warning` | `bg-warning-subtle/30` | `border-warning-subtle/50` | `text-warning-subtle-foreground` |

## Code Example

```tsx
import StatCard from "@/components/molecules/StatCard";
import { Users } from "lucide-react";

<StatCard
  icon={<Users className="w-4 h-4" />}
  label="Total Pemilih"
  value={120}
  variant="secondary"
/>
```
