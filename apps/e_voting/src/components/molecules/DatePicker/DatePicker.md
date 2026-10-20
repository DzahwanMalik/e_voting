# DatePicker Component

- **Level**: Molecule
- **Folder**: `src/components/molecules/DatePicker/`

## Purpose

Reusable read-only date picker control. The trigger behaves like a dropdown (mirroring `Select`), and opens a floating calendar popover. Users **cannot type a date** — they select it from the calendar, with month and year navigation handled inside the popover.

The value contract is the same as a native `<input type="date">`: a `YYYY-MM-DD` string (or `null`/empty when unset). API values in ISO datetime format should be normalized with `toDateInputValue()` from `@/lib/utils`.

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | — | Applied to the trigger button so `<FormField>` labels can target it |
| `name` | `string` | — | Field name (useful with React Hook Form) |
| `value` | `string \| null` | `null` | Selected date in `YYYY-MM-DD` format (controlled) |
| `onChange` | `(value: string) => void` | — | Called when a day is selected |
| `onBlur` | `() => void` | — | Called when the popover closes (selection, outside click, or Escape) |
| `placeholder` | `string` | `"Pilih tanggal"` | Text shown when no date is selected |
| `disabled` | `boolean` | `false` | Disables the trigger |
| `isInvalid` | `boolean` | `false` | Shows destructive border/focus ring |
| `className` | `string` | `""` | Additional class for the container |

## Component Composition

- **Trigger**: `<Input>` atom (`readOnly`) with `leftElement` (calendar icon) and `rightElement` (chevron). `Input` already provides the correct field styling, invalid state, and disabled state, so no styles are duplicated.
- **Calendar navigation & day/month/year cells**: native `<button>` elements. Their compact icon sizing, focus ring (no offset), and selected/today/hover behavior differ from the `Button` atom's CTA styling, so the calendar keeps native buttons internally (same approach as `Select`'s option list). `Button` atom remains reserved for actual actions (submit/cancel, row actions).

## Behavior

1. Clicking the trigger opens a fixed-position popover below it (flips above when space is insufficient and clamps horizontally to the viewport).
2. The popover opens on the selected date's month, or the current month when empty.
3. Header navigation:
   - `days` view: `‹` / `›` change month; clicking the month-year label switches to **months** view.
   - `months` view: `‹` / `›` change year; clicking the year label switches to **years** view.
   - `years` view: `‹` / `›` change the 12-year range; selecting a year switches to **months** view.
4. Selecting a day calls `onChange("YYYY-MM-DD")` and closes the popover.
5. Click outside or press `Escape` to close; both trigger `onBlur`.

Positioning and dismissal mirror `DropdownMenu`/`Select`: `useLayoutEffect` for pre-paint placement, plus scroll/resize tracking and click-outside/Escape listeners.

## Semantic Tokens Used

- Trigger (via `Input` atom): `bg-card`, `text-foreground`, `border-input`, `hover:border-border-hover`, `focus:border-primary`, `focus:ring-primary`
- Placeholder: `text-muted-foreground`
- Error (via `Input` `isInvalid`): `border-destructive`, `text-destructive`, `focus:ring-destructive`
- Disabled (via `Input`): `bg-muted`, `cursor-not-allowed`, `opacity-70`
- Popover: `bg-card`, `border-border`, `rounded-xl`, `shadow-lg`
- Nav buttons: `text-muted-foreground`, `hover:bg-accent`, `focus:ring-ring`
- Selected day/month/year: `bg-primary`, `text-primary-foreground`, `hover:bg-primary-hover`
- Today: `border-primary`, `text-primary`
- Hover: `bg-accent`
- Muted labels: `text-muted-foreground`
- Focus ring: `focus:ring-ring`

## Code Example

```tsx
import { Controller, useForm } from "react-hook-form";
import DatePicker from "@/components/molecules/DatePicker";
import FormField from "@/components/molecules/FormField";
import { toDateInputValue } from "@/lib/utils";

const { control, reset } = useForm<{ birthday: string }>();

reset({ birthday: toDateInputValue(apiUser.birthday) });

<FormField id="birthday" label="Tanggal Lahir" required>
  <Controller
    control={control}
    name="birthday"
    render={({ field, fieldState }) => (
      <DatePicker
        id="birthday"
        name={field.name}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        isInvalid={Boolean(fieldState.error)}
        placeholder="Pilih tanggal lahir"
      />
    )}
  />
</FormField>;
```
