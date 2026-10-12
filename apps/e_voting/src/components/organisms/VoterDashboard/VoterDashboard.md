# VoterDashboard Component

- **Level**: Organism
- **Folder**: `src/components/organisms/VoterDashboard/`

## Purpose
Modular view organism for the Voter role. Encapsulates eligible elections retrieval and renders each election as its own dedicated card (`<VoterElectionCard />`) inside a grid container. Eliminates pill tabs in favor of a clear, comprehensive one-election-one-card layout with candidate pairs selectable via radio inputs and a dedicated footer voting button per card. Uses reusable `LoadingState` and `EmptyState` molecules for async display states; errors are communicated via toast notification only.

## Props
- `displayName`: `string` - The formatted display name of the logged-in voter.

## Semantic Tokens Used
- Card Surface: `bg-card`, `border-border`, `text-card-foreground`, `rounded-3xl` (via `SectionCard`)
- Status Callouts: `bg-success-subtle`, `text-success-subtle-foreground`, `bg-secondary`, `text-secondary-foreground`
- Badges: `bg-primary`, `bg-muted`
- Buttons: `bg-primary`, `text-primary-foreground`

## Component Composition
- Uses `<SectionCard>` molecule for the welcome banner card shell
- Composes `<VoterElectionCard>` organisms (each using SectionCard internally) in a responsive grid
- Uses `<LoadingState>` and `<EmptyState>` molecules directly (no card wrapper) for async/empty states

## Code Example
```tsx
import VoterDashboard from "@/components/organisms/VoterDashboard";

<VoterDashboard displayName="Andi Saputra" />
```

