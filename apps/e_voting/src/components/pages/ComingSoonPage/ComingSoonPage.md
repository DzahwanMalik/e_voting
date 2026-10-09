# ComingSoonPage

- **Level**: Page
- **Folder**: `src/components/pages/ComingSoonPage/`

## Purpose

Placeholder page displayed for admin/super admin navigation items that are not yet implemented (Elections, Candidates, Voters, Admin Assignment, Results). Renders within the `AdminDashboardLayout` (Sidebar stays visible).

## Props

- `title`: Page heading — the name of the feature being developed.
- `description`: Optional sub-description (defaults to a generic "under development" message).
- `icon`: Optional React node for the placeholder icon (defaults to `<Wrench />`).

## Semantic Tokens Used

- `bg-card`, `border-border`, `text-card-foreground` — card surface
- `bg-muted`, `text-muted-foreground` — placeholder icon container
- `bg-background` — page canvas (via AdminDashboardLayout)

## Code Example

```tsx
import ComingSoonPage from "@/components/pages/ComingSoonPage";

<ComingSoonPage title="Manajemen Pemilihan" />
```

