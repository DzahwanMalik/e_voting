# VoterElectionCard Component

- **Level**: Organism
- **Folder**: `src/components/organisms/VoterElectionCard/`

## Purpose
Comprehensive card container representing a single election per voter requirements. Encapsulates the election title and description, a status notice banner communicating the voter's voting state (Hak Suara Telah Digunakan / Pilih Kandidat Anda), a candidate list rendered as interactive radio cards, and a dedicated footer containing chosen-candidate feedback and the "Kirim Suara" submission button with confirmation dialog. The voter's voting status is surfaced via the banner and footer rather than a separate vote-status badge, and the election creation date is intentionally not displayed to voters.

## Props
- `election`: `ElectionListItem` - The election data including candidates and hasVoted state.
- `onVoteSuccess`: `(electionId: number) => void` - Callback executed after a successful vote.
- `onViewCandidateDetail`: `(candidate: Candidate) => void` - Callback to view full candidate details.

## Semantic Tokens Used
- Card Surface: `bg-card`, `border-border`, `text-card-foreground`, `rounded-3xl` (via `SectionCard`)
- Description: `text-muted-foreground`, `border-border` (divider above status banner)
- Status Notice Banner: `bg-success-subtle/50`, `text-success-subtle-foreground` (voted); `bg-secondary/50`, `text-secondary-foreground` (not voted)
- Footer Bar: `bg-muted/30`, `border-border` (SectionCard footer shell)
- Action Button: `bg-primary`, `text-primary-foreground`

## Component Composition
- Uses `<SectionCard>` molecule for the card shell, passing `title` and structured `footer` props
- Composes `<CandidateRadioCard>` molecules for candidate selection
- Uses `<VoteConfirmModal>` organism for vote confirmation

## Code Example
```tsx
import VoterElectionCard from "@/components/organisms/VoterElectionCard";

<VoterElectionCard
  election={election}
  onVoteSuccess={handleVoteSuccess}
  onViewCandidateDetail={handleOpenDetail}
/>
```

