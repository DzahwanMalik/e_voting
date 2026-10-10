# Checkbox Component

- **Level**: Atom
- **Folder**: `src/components/atoms/Checkbox/`

## Purpose

Custom checkbox input wrapper for admin assignment selection and other multi-select UIs. Wraps native `<input type="checkbox">` with a label and semantic token styling.

## Props

- `ref?: Ref<HTMLInputElement>` — forwarded ref for `react-hook-form` compatibility
- `label?: ReactNode` — optional label displayed beside the checkbox
- `isChecked?: boolean` — controlled checked state
- Extends `Omit<InputHTMLAttributes<HTMLInputElement>, "children">`

## Semantic Tokens Used

- Checkmark / border: `border-input`, `bg-primary`
- Text: `text-foreground`
- Focus: `focus:ring-ring`, `focus:ring-offset-2`

## Code Example

```tsx
import Checkbox from "@/components/atoms/Checkbox";

<Checkbox
  isChecked={isSelected}
  label="Pilih Admin"
  onChange={(e) => setIsSelected(e.target.checked)}
/>
```
