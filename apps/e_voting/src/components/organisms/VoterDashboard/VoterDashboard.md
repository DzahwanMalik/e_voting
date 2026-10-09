# VoterDashboard Component

- **Level**: Organism
- **Folder**: `src/components/organisms/VoterDashboard/`

## Purpose
Modular view organism for the Voter role. Encapsulates eligible elections retrieval and renders each election as its own dedicated card (`<VoterElectionCard />`) inside a grid container. Eliminates pill tabs in favor of a clear, comprehensive one-election-one-card layout with candidates selectable via radio inputs and a dedicated footer voting button per card. Uses reusable `LoadingState` and `EmptyState` molecules for async display states; errors are communicated via toast notification only.

## Props
- `displayName`: `string` - The formatted display name of the logged-in voter.

## Semantic Tokens Used
- Card Surface: `bg-card`, `border-border`, `text-card-foreground`, `shadow-sm`, `rounded-3xl`
- Status Callouts: `bg-success-subtle`, `text-success-subtle-foreground`, `bg-secondary`, `text-secondary-foreground`
- Badges: `bg-primary`, `bg-muted`
- Buttons: `bg-primary`, `text-primary-foreground`

## Code Example
```tsx
import VoterDashboard from "@/components/organisms/VoterDashboard";

<VoterDashboard displayName="Andi Saputra" />
```

