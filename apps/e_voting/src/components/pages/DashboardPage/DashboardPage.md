# DashboardPage Component

- **Level**: Page
- **Folder**: `src/components/pages/DashboardPage/`

## Purpose
The `DashboardPage` component serves as the post-login destination view for all three system roles (Super Admin, Admin, and Voter) per the PRD. It is a completely self-contained page component that dynamically adapts its header, badge, and capability overview to reflect the active user's role scope, and provides an immediate logout mechanism.

## Props
None. This component is self-contained (`<DashboardPage />`) and dynamically derives user role and context from the navigation state and active route.

## Semantic Tokens Used
- Surfaces & Card: `bg-background`, `bg-card`, `border-border`, `shadow-sm`, `rounded-3xl`
- Status Badges: `bg-info-subtle`, `bg-warning-subtle`, `bg-success-subtle`
- Typography: `font-heading` for brand logo, `font-sans` for headers and copy

## Code Example
```tsx
import { DashboardPage } from "@/components/pages/DashboardPage";

// Standard route usage without props
export default function App() {
  return <DashboardPage />;
}
```
