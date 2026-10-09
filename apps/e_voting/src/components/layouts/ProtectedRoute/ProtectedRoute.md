# ProtectedRoute Component

- **Level**: Layout / Guard
- **Folder**: `src/components/layouts/ProtectedRoute/`

## Purpose
The `ProtectedRoute` component protects authenticated route segments in React Router. It inspects `localStorage` token existence and reactive user profile state in `useUserStore`. Unauthenticated users are redirected to `/login`, and users attempting to access routes outside their authorized role are redirected to their respective role landing page.

## Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `allowedRoles` | `UserRole[]` | `undefined` | Optional array of permitted roles (`SUPER_ADMIN`, `ADMIN`, `VOTER`) |

## Code Example
```tsx
import ProtectedRoute from "@/components/layouts/ProtectedRoute";
import { Route } from "react-router";

<Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]} />}>
  <Route path="/voter/dashboard" element={<VoterDashboardPage />} />
</Route>
```

