# TabList Component

- **Level**: Molecule
- **Folder**: `src/components/molecules/TabList/`

## Purpose
The `TabList` component renders a horizontally scrollable row of pill tabs (`Tab` atoms) used for single-select filtering. It is controlled: the parent owns the active `value` and receives changes through `onChange`. It is generic over the value type, so it works with string or numeric identifiers (e.g. election ids).

## Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` | `TabListItem<TValue>[]` | — | List of tabs to render |
| `value` | `TValue` | — | Currently active tab value |
| `onChange` | `(value: TValue) => void` | — | Called with the clicked tab value |
| `ariaLabel` | `string` | `'Filter'` | Accessible label for the tab group |
| `className` | `string` | `''` | Extra classes for the scroll container |

### `TabListItem<TValue>`
| Field | Type | Description |
| :--- | :--- | :--- |
| `value` | `TValue` | Unique identifier for the tab |
| `label` | `string` | Visible label text |
| `count` | `number` | Optional numeric badge |
| `icon` | `ReactNode` | Optional leading icon |

## Behavior
- Controlled component — it never stores state internally.
- Renders `null` when `items` is empty, so consumers can render it unconditionally.
- The container uses `overflow-x-auto` + `scrollbar-none` with internal padding and compensating negative margin (`p-1.5 -m-1.5`) so many tabs scroll horizontally without clipping focus rings, outlines, or shadows at container edges; each tab is `shrink-0` via the `Tab` atom.
- The container uses `role="group"` with `aria-label`; each `Tab` exposes `aria-pressed` for the active state (toggle-button semantics, since there are no linked tabpanels).

## Semantic Tokens Used
- Inherits pill styling from the `Tab` atom.
- Scroll container: `scrollbar-none` utility (defined in `global.css`).

## Dependencies
- `Tab` — `@/components/atoms/Tab`

## Code Example
```tsx
import TabList, { type TabListItem } from "@/components/molecules/TabList";

const items: TabListItem<number | "all">[] = [
  { value: "all", label: "Semua", count: 12 },
  { value: 3, label: "Pemilihan Ketua BEM", count: 4 },
];

<TabList
  items={items}
  value={filter}
  onChange={setFilter}
  ariaLabel="Filter paslon berdasarkan pemilihan"
/>
```
