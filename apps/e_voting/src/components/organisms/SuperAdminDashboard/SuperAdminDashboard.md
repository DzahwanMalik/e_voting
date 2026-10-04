# SuperAdminDashboard Component

- **Level**: Organism
- **Folder**: `src/components/organisms/SuperAdminDashboard/`

## Purpose
Modular view organism for the Super Admin role per PRD Section 2.1. Displays full system governance privileges, high-level aggregated metrics (total elections, total candidates), and a centralized overview of all elections in the database.

## Props
- `displayName`: `string` - Formatted name of the super administrator.

## Semantic Tokens Used
- Card Surface: `bg-card`, `border-border`, `text-card-foreground`, `shadow-sm`, `rounded-3xl`
- Status Badges: `bg-info`, `text-info-foreground`, `bg-secondary`, `text-secondary-foreground`
- Stat Containers: `bg-primary/10`, `bg-secondary`

## Code Example
```tsx
import { SuperAdminDashboard } from "@/components/organisms/SuperAdminDashboard";

<SuperAdminDashboard displayName="Super Administrator" />
```
