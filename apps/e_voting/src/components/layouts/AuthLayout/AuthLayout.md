# AuthLayout Component

- **Level**: Layout
- **Folder**: `src/components/layouts/AuthLayout/`

## Purpose
The `AuthLayout` component provides the outer responsive container for authentication pages. It features an airy neutral canvas, ambient lighting effects, an accessible header with brand emblem and version badge, a centered `rounded-3xl` card container, and footer metadata.

## Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `children` | `ReactNode` | **required** | The form or content to render inside the card |
| `title` | `string` | `"E-Voting"` | Card title |
| `subtitle` | `string` | `"Sistem Pemungutan Suara Digital"` | Subheading explanation |
| `badgeText` | `string` | `"MVP v0.1.0"` | Top header badge pill text |

## Semantic Tokens Used
- Outer Canvas: `bg-background`
- Card Container: `bg-card`, `border-border`, `shadow-sm`, `rounded-3xl`
- Brand & Badges: `bg-primary`, `bg-secondary`, `text-secondary-foreground`
- Typography: `font-heading`, `font-sans`, `text-foreground`, `text-muted-foreground`

## Code Example
```tsx
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { LoginForm } from "@/components/organisms/LoginForm";

<AuthLayout title="Selamat Datang" subtitle="Masuk untuk mengakses sistem pemilihan">
  <LoginForm onSubmit={handleLogin} />
</AuthLayout>
```
