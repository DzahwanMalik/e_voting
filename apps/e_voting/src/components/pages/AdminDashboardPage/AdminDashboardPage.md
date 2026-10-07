# AdminDashboardPage

- **Level**: Page
- **Folder**: `src/components/pages/AdminDashboardPage/`

## Purpose

Renders the appropriate dashboard organism based on the user's role:

- **Super Admin** → `SuperAdminDashboard` (full system view)
- **Admin** → `AdminDashboard` (assigned elections only)

This page is a child route of `AdminShellPage` and is rendered inside the `AdminDashboardLayout` (which provides the Sidebar navigation).

## Props

Takes no props — resolves role and display name from `useUserStore`.

## Code Example

```tsx
// Inside AdminShellPage route
<Route path="/admin/dashboard" element={<AdminDashboardPage />} />
```
