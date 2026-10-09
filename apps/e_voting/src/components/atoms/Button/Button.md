# Button Component

- **Level**: Atom
- **Folder**: `src/components/atoms/Button/`

## Purpose
The `Button` component provides standard interactive trigger elements with support for semantic styles, sizes, loading spinners, and an icon positioned on the left.

## Props & Variants
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'destructive'` | `'primary'` | Visual aesthetic variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height and padding scale |
| `isLoading` | `boolean` | `false` | Displays spinning indicator on the left and disables click |
| `icon` | `ReactNode` | `undefined` | Icon element positioned on the left |
| `fullWidth` | `boolean` | `false` | Stretches button width to 100% |

## Semantic Tokens Used
- Primary: `bg-primary`, `hover:bg-primary-hover`, `text-primary-foreground`
- Secondary: `bg-secondary`, `text-secondary-foreground`, `hover:bg-accent`
- Outline: `border-border`, `text-foreground`, `hover:bg-accent`
- Radius: `rounded-xl`
- Focus: `focus:ring-2 focus:ring-ring focus:ring-offset-2`

## Code Example
```tsx
import Button from "@/components/atoms/Button";
import { LogIn } from "lucide-react";

<Button
  variant="primary"
  size="md"
  fullWidth
  isLoading={isSubmitting}
  icon={<LogIn className="w-4 h-4" />}
>
  Masuk
</Button>
```

