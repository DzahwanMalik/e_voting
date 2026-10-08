# AdminShellPage

- **Level**: Page (Layout Route)
- **Folder**: `src/components/pages/AdminShellPage/`

## Purpose

Layout route component for all Admin and Super Admin routes. Wraps child routes (Elections, Candidates, Voters, Admin Assignment, Results) inside the `AdminDashboardLayout` (which includes the Sidebar organism).

This component centralizes:
- Role resolution from Zustand store (`isSuperAdmin()`)
- Display role name & user display name
- Logout handler (token cleanup, store clear, navigation to `/login`)
- `isLoggingOut` loading state

Child routes render their content via `<Outlet />` inside the layout.

## Props

Takes no props — reads all state from `useUserStore`.

## Code Example

```tsx
// Inside <Routes> in main.tsx
<Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]} />}>
  <Route element={<AdminShellPage />}>
    <Route path="/admin/elections" element={<ComingSoonPage title="Manajemen Pemilihan" />} />
    ...
  </Route>
</Route>
```
