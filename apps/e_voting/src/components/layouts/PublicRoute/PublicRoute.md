# PublicRoute Component

- **Level**: Layout / Guard
- **Folder**: `src/components/layouts/PublicRoute/`

## Purpose
The `PublicRoute` component wraps guest-only pages like `/login`. It prevents authenticated users who already possess an active session token and user profile from accessing the login page, redirecting them immediately to their designated dashboard.

## Props
None. Self-contained guard wrapper.

## Code Example
```tsx
import { PublicRoute } from "@/components/layouts/PublicRoute";
import { Route } from "react-router";

<Route element={<PublicRoute />}>
  <Route path="/login" element={<LoginPage />} />
</Route>
```
