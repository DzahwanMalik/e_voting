# AdminDashboard Component

- **Level**: Organism
- **Folder**: `src/components/organisms/AdminDashboard/`

## Purpose
Modular view organism for the Admin role per PRD Section 2.2. Displays administrator scope and role capabilities, and fetches and renders all elections assigned to this admin with live candidate tallies.

## Props
- `displayName`: `string` - Formatted name of the active administrator.

## Semantic Tokens Used
- Card Surface: `bg-card`, `border-border`, `text-card-foreground`, `shadow-sm`, `rounded-3xl`
- Status Badges: `bg-warning-subtle`, `text-warning-subtle-foreground`
- Muted Area: `bg-muted`, `text-muted-foreground`

## Code Example
```tsx
import { AdminDashboard } from "@/components/organisms/AdminDashboard";

<AdminDashboard displayName="Administrator" />
```
