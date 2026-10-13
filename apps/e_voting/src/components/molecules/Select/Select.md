# Select Component

- **Level**: Molecule
- **Folder**: `src/components/molecules/Select/`

## Purpose

Reusable custom dropdown select control that manages its own popover UI internally. Unlike a thin native `<select>` wrapper, the `Select` renders a styled trigger button (matching `Input` atom token styling) with a `ChevronDown` indicator, and a floating popover containing a scrollable list of options. The parent only needs to pass an `options` array — all dropdown open/close, positioning, and keyboard (Escape) behavior is handled internally.

Positioning logic mirrors the `DropdownMenu` molecule (`useLayoutEffect` measuring listbox dimensions + click-outside/Escape-to-close via `useEffect`).

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `options` | `SelectOption<T>[]` | — (required) | Array of `{ label, value, disabled? }` items rendered in the dropdown |
| `value` | `T \| null` | `null` | Currently selected value (controlled) |
| `onChange` | `(value: T \| null) => void` | — | Called with the new value when an option is selected |
| `placeholder` | `string` | `"Pilih..."` | Text shown in the trigger when no value is selected |
| `disabled` | `boolean` | `false` | Disables the entire select |
| `isInvalid` | `boolean` | `false` | Shows red border and destructive focus ring |
| `className` | `string` | `""` | Additional class for the container |

### SelectOption<T>

| Field | Type | Description |
| :--- | :--- | :--- |
| `label` | `string` | Display text for the option |
| `value` | `T` | Option value (must match `value`/`onChange` type generic) |
| `disabled` | `boolean` | Optional — disables individual option |

Generic `T` defaults to `string \| number` and can be inferred from the `options` prop.

## Semantic Tokens Used

- Trigger: `bg-card`, `text-foreground`, `border-input`, `hover:border-border-hover`, `focus:border-primary`, `focus:ring-primary`
- Placeholder text: `text-muted-foreground`
- Error state: `border-destructive`, `text-destructive`, `focus:ring-destructive`, `focus:border-destructive`
- Disabled: `bg-muted`, `cursor-not-allowed`, `opacity-70`
- Popover: `bg-card`, `border-border`, `rounded-xl`, `shadow-lg`, `overflow-y-auto`
- Selected option: `bg-primary/10`, `text-primary`
- Hover: `bg-accent`
- Chevron icon: `text-muted-foreground`
- Radius: `rounded-xl`

## Code Example

```tsx
import Select, { type SelectOption } from "@/components/molecules/Select";

const options: SelectOption<number>[] = [
  { label: "Pemilihan Umum 2024", value: 1 },
  { label: "Pilkada 2025", value: 2, disabled: true },
];

const [selectedId, setSelectedId] = useState<number | null>(null);

<Select
  value={selectedId}
  onChange={setSelectedId}
  options={options}
  placeholder="Pilih election..."
/>
```
