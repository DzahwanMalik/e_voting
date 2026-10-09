# LoginForm Component

- **Level**: Organism
- **Folder**: `src/components/organisms/LoginForm/`

## Purpose
The `LoginForm` component provides the core credential authentication interface for the E-Voting System MVP powered by **React Hook Form** and **Zod** schema validation. Per the PRD, it accepts `username` and `password` for all three system roles (Super Admin, Admin, and Voter), providing type-safe validation, touch-triggered feedback, password reveal toggling, submission feedback, and security context copy. Global notifications/error toasts are handled via toast notifications (e.g., Sonner).

## Validation Schema (`LoginForm.schema.ts`)
```ts
import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Username wajib diisi")
    .refine((val) => val.trim().length > 0, {
      message: "Username wajib diisi",
    }),
  password: z.string().min(1, "Password wajib diisi"),
});
```

## Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `onSubmit` | `(credentials: LoginCredentials) => Promise<void> \| void` | `undefined` | Callback fired upon valid form submission |
| `isLoading` | `boolean` | `false` | Sets button and inputs to loading/disabled state |
| `initialUsername` | `string` | `""` | Initial pre-filled username |
| `initialPassword` | `string` | `""` | Initial pre-filled password |

## Validation & Form Features
- Validated via `zodResolver(loginSchema)` from `@hookform/resolvers/zod`.
- Strict type-inference using `z.infer<typeof loginSchema>`.
- Touch-triggered validation feedback (`mode: "onTouched"`).
- Direct `ref` forwarding into the `Input` atom via `{...register()}`.
- Re-synchronization of default values when preset credentials change.
- Toast-ready: external error handling is decoupled from the form component.

## Semantic Tokens Used
- Inputs & Borders: `bg-card`, `border-input`, `border-border`
- Notice Box: `bg-muted`, `border-border`, `text-muted-foreground`, `text-primary`
- Button CTA: `bg-primary`, `hover:bg-primary-hover`, `text-primary-foreground`

## Code Example
```tsx
import LoginForm from "@/components/organisms/LoginForm";

<LoginForm
  isLoading={isSubmitting}
  onSubmit={async ({ username, password }) => {
    // Process login credentials validated by Zod
  }}
/>
```

