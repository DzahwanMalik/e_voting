# FormField Component

- **Level**: Molecule
- **Folder**: `src/components/molecules/FormField/`

## Purpose
The `FormField` component composes an input element with its corresponding `Label`, error feedback indicator, and helper hints.

## Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | **required** | Element identifier for label pairing |
| `label` | `string` | **required** | Field title displayed in the label |
| `required` | `boolean` | `false` | Shows required indicator (`*`) |
| `optional` | `boolean` | `false` | Shows optional indicator (`(opsional)`) |
| `error` | `string` | `undefined` | Error feedback message |
| `hint` | `string` | `undefined` | Subtle helper hint |
| `children` | `ReactNode` | **required** | Input control or atom |

## Semantic Tokens Used
- Error feedback: `text-destructive`
- Helper hint: `text-muted-foreground`

## Code Example
```tsx
import { FormField } from "@/components/molecules/FormField";
import { Input } from "@/components/atoms/Input";

{/* Required Field */}
<FormField id="username" label="Username" required error={errors.username}>
  <Input id="username" placeholder="Masukkan username" />
</FormField>

{/* Optional Field */}
<FormField id="description" label="Deskripsi" optional>
  <Input id="description" placeholder="Masukkan deskripsi opsional" />
</FormField>
```
