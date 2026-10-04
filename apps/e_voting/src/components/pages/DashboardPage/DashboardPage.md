# DashboardPage Component

- **Level**: Page
- **Folder**: `src/components/pages/DashboardPage/`

## Purpose
The `DashboardPage` serves as the primary route container for post-authentication navigation across all three system roles (Super Admin, Admin, and Voter). It delegates role-specific functionality to dedicated, modular organism components:

- **Voter**: Rendered via `<VoterDashboard />` (`src/components/organisms/VoterDashboard/`)
- **Admin**: Rendered via `<AdminDashboard />` (`src/components/organisms/AdminDashboard/`)
- **Super Admin**: Rendered via `<SuperAdminDashboard />` (`src/components/organisms/SuperAdminDashboard/`)

## Architecture & Modular Separation
By separating role views into dedicated organisms and using `DashboardLayout`:
1. The page component strictly orchestrates role resolution and delegates presentation to `<DashboardLayout>`.
2. `<DashboardLayout>` manages top navbar, branding, role badge, user display, and logout button cleanly.
3. Each dashboard role view (`<VoterDashboard>`, `<AdminDashboard>`, `<SuperAdminDashboard>`) is isolated, maintainable, and easy to read.

## Props
None. Self-contained page component reading from Zustand store and active route.

## Semantic Tokens Used
- Outer Canvas & Shell: `bg-background`, `bg-card`, `border-border`, `shadow-xs`
- Brand & Actions: `bg-primary`, `text-primary-foreground`
- Status Badges: `bg-info`, `bg-warning`, `bg-success`

## Code Example
```tsx
import { DashboardPage } from "@/components/pages/DashboardPage";

// In router configuration
<Route path="/voter/dashboard" element={<DashboardPage />} />
<Route path="/admin/dashboard" element={<DashboardPage />} />
```
