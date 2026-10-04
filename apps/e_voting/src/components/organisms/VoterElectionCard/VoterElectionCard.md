# VoterElectionCard Component

- **Level**: Organism
- **Folder**: `src/components/organisms/VoterElectionCard/`

## Purpose
Comprehensive card container representing a single election per voter requirements. Encapsulates election header, candidate list rendered as interactive radio cards, and a dedicated footer containing chosen candidate feedback and the "Kirim Suara" submission button with confirmation dialog.

## Props
- `election`: `ElectionListItem` - The election data including candidates and hasVoted state.
- `onVoteSuccess`: `(electionId: number) => void` - Callback executed after a successful vote.
- `onViewCandidateDetail`: `(candidate: Candidate) => void` - Callback to view full candidate details.

## Semantic Tokens Used
- Card Surface: `bg-card`, `border-border`, `text-card-foreground`, `shadow-sm`, `rounded-3xl`
- Status Badges: `bg-success-subtle`, `text-success-subtle-foreground`, `bg-pending-subtle`, `text-pending-subtle-foreground`
- Footer Bar: `bg-muted/20`, `border-border`
- Action Button: `bg-primary`, `text-primary-foreground`

## Code Example
```tsx
import { VoterElectionCard } from "@/components/organisms/VoterElectionCard";

<VoterElectionCard
  election={election}
  onVoteSuccess={handleVoteSuccess}
  onViewCandidateDetail={handleOpenDetail}
/>
```
