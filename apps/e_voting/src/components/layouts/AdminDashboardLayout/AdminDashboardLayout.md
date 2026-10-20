# AdminDashboardLayout

- **Level**: Layout
- **Folder**: `src/components/layouts/AdminDashboardLayout/`

## Purpose

Layout shell for all Admin and Super Admin section pages. Uses a vertical Sidebar (organism) for role-based navigation instead of the top-navbar-only `VoterDashboardLayout` used by Voters.

**Key difference from `VoterDashboardLayout`:**

| Aspect | `VoterDashboardLayout` (Voter) | `AdminDashboardLayout` (Admin/Super Admin) |
|---|---|---|
| Navbar | Top sticky navbar (centered) | Sidebar on left (fixed, `w-64`) |
| User info / logout | In top navbar | In Sidebar footer |
| Mobile | N/A (desktop-centered) | Sticky top navbar + Hamburger slide-out drawer |
| Role | Voter only | Admin & Super Admin |

## Responsive Behavior

- **Mobile (`< md`)**: Layout switches to `flex-col`. Top sticky header renders brand identity and hamburger trigger. Content fills full screen width (`w-full`) without margin offsets.
- **Desktop (`>= md`)**: Layout switches to `flex-row`. Vertical sidebar is fixed at `w-64`, and `<main>` is offset by `md:ml-64`.

## Props

- `children`: Page content rendered inside `<main>`.
- `roleName`: `"Super Admin" | "Admin"` — passed to Sidebar for role-aware nav items.
- `displayName`: Active user's name — passed to Sidebar footer.
- `onLogout`: Logout callback — passed to Sidebar.
- `isLoggingOut`: Optional loading state.
- `isSuperAdmin`: Optional `boolean` (default `false`) — passed to Sidebar to reveal `isSuperAdminOnly` nav items (Admin & Pengaturan).

## Semantic Tokens Used

- `bg-background`, `text-foreground` — page canvas
- `bg-card`, `border-border` — sidebar surface (via Sidebar component)

## Code Example

```tsx
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";

<AdminDashboardLayout
  roleName="Super Admin"
  displayName="Budi Santoso"
  onLogout={handleLogout}
  isLoggingOut={false}
>
  <YourAdminContent />
</AdminDashboardLayout>
```

