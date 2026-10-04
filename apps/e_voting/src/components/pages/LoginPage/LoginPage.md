# LoginPage Component

- **Level**: Page
- **Folder**: `src/components/pages/LoginPage/`

## Purpose
The `LoginPage` component represents the login view route for the E-Voting System MVP. It is self-contained (`<LoginPage />`), orchestrating the `AuthLayout` shell, the `LoginForm` organism, and rapid demo role presets. Upon successful submission, it **immediately navigates to each role's respective dashboard** without any intermediate screen:
- **Super Admin & Admin**: `/admin/dashboard`
- **Voter**: `/voter/dashboard`

## Props
None. This component is completely self-contained.

## Semantic Tokens Used
- Shell & Container: `bg-background`, `bg-card`, `border-border`, `shadow-sm`, `rounded-3xl`
- Quick Role Pills: `bg-secondary`, `text-secondary-foreground`, `hover:bg-accent`

## Code Example
```tsx
import { LoginPage } from "@/components/pages/LoginPage";

// Standard route usage without props
export default function App() {
  return <LoginPage />;
}
```
