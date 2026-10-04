# Label Component

- **Level**: Atom
- **Folder**: `src/components/atoms/Label/`

## Purpose
The `Label` component provides accessible form input descriptions formatted with consistent typography, requirement indicators (`*`), and optional field marks (`(optional)`).

## Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `required` | `boolean` | `false` | Renders a subtle red asterisk indicator (`*`) |
| `optional` | `boolean` | `false` | Renders an optional indicator (`(optional)`) |

## Semantic Tokens Used
- Text: `text-muted-foreground`
- Required indicator: `text-destructive`
- Optional indicator: `text-muted-foreground`

## Code Example
```tsx
import { Label } from "@/components/atoms/Label";

{/* Required Field */}
<Label htmlFor="username" required>
  Username
</Label>

{/* Optional Field */}
<Label htmlFor="description" optional>
  Deskripsi
</Label>
```
