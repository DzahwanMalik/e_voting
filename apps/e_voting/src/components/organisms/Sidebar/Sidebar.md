# Sidebar Component

- **Level**: Organism
- **Folder**: `src/components/organisms/Sidebar/`

## Purpose

Vertical navigation rail for the Admin and Super Admin shell layouts. Provides role-aware navigation items based on PRD permissions:

| Nav Item | Admin | Super Admin | Rationale |
|---|---|---|---|
| Pemilihan (Elections) | ✓ | ✓ | BR-05: Admin manages assigned; BR-03/04: Super Admin manages all |
| Kandidat (Candidates) | ✓ | ✓ | Manage candidates within election scope |
| Pemilih (Voters) | ✓ | ✓ | Create & enroll voters within scope |
| Penugasan Admin | — | ✓ | BR-06: Only Super Admin assigns admins |
| Hasil Voting (Results) | — | ✓ | BR-12: Only Super Admin views vote results |

## Props

- `roleName`: `"Super Admin" | "Admin"` — controls visibility of superAdmin-only nav items.
- `displayName`: Active user's name or username — displayed in the footer.
- `onLogout`: Callback when the logout button is clicked.
- `isLoggingOut`: Optional loading state for the logout action.

## Semantic Tokens Used

- `bg-card`, `border-border`, `text-foreground` — sidebar surface
- `bg-primary`, `text-primary-foreground` — active nav item
- `bg-accent`, `text-accent-foreground` — hover nav item
- `bg-muted` — user avatar placeholder
- `bg-destructive` — (future) destructive actions

## Responsive Behavior

- **Desktop (>= `md` breakpoint)**: Sidebar is a fixed, full-height vertical rail on the left (`w-64`).
- **Mobile (`< md`)**: Sidebar is hidden; a hamburger button in the mobile header opens a fixed overlay with backdrop blur.

## Code Example

```tsx
import Sidebar from "@/components/organisms/Sidebar";

<Sidebar
  roleName="Super Admin"
  displayName="Budi Santoso"
  onLogout={handleLogout}
  isLoggingOut={false}
/>
```

