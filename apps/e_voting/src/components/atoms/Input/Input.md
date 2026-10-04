# Input Component

- **Level**: Atom
- **Folder**: `src/components/atoms/Input/`

## Purpose
The `Input` component renders standard textual input fields with integrated support for invalid validation states, leading adornments (`leftElement`), and trailing controls (`rightElement`).

## Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `isInvalid` | `boolean` | `false` | Shows red border and destructive focus rings |
| `leftElement` | `ReactNode` | `undefined` | Icon or prefix element inside the input |
| `rightElement` | `ReactNode` | `undefined` | Action or icon element (e.g. password visibility toggle) |

## Semantic Tokens Used
- Base: `bg-card`, `text-foreground`, `placeholder:text-muted-foreground`
- Border: `border-input`, `hover:border-border-hover`
- Focus: `focus:border-primary`, `focus:ring-primary`
- Error: `border-destructive`, `text-destructive`, `focus:ring-destructive`
- Disabled: `bg-muted`
- Radius: `rounded-xl`

## Code Example
```tsx
import { Input } from "@/components/atoms/Input";
import { User } from "lucide-react";

<Input
  placeholder="Masukkan username"
  leftElement={<User className="w-4 h-4" />}
  isInvalid={Boolean(errors.username)}
/>
```
