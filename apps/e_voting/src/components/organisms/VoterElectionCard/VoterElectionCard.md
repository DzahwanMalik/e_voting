# VoterElectionCard Component

- **Level**: Organism
- **Folder**: `src/components/organisms/VoterElectionCard/`

## Purpose
Comprehensive card container representing a single election per voter requirements. Encapsulates the election title and description, a status notice banner communicating the voter's voting state (Hak Suara Telah Digunakan / Pilih Paslon Kandidat Anda), a candidate pair list rendered as interactive radio cards (or grid card layout for single elections), and a dedicated footer containing chosen-pair feedback and the "Kirim Suara" submission button with confirmation dialog. The voter's voting status is surfaced via the banner and footer rather than a separate vote-status badge, and the election creation date is intentionally not displayed to voters.

## Props
- `election`: `ElectionListItem` - The election data including candidate pairs (`candidatePairs`) and `electionVoters` hasVoted state.
- `onVoteSuccess`: `(electionId: number) => void` - Callback fired after a successful vote submission.
- `onViewCandidateDetail`: `(candidatePair: CandidatePair) => void` - Callback to view full candidate pair details.

## Notes on View Layout
- When a voter is enrolled in **multiple elections**, cards render with the compact radio-list layout.
- When a voter is enrolled in **a single election** (full-width context), the card switches to a grid layout using `<CandidateCard>` for a richer visual experience.

## API Integration
- Uses `getElectionByIdApi` (from `election.service.ts`) to lazily fetch candidate pairs when not included in the election list response.
- Uses `castVoteApi` to submit votes with `candidatePairId` in the payload.

## Semantic Tokens Used
- Card: `bg-card`, `border-border`, `shadow-xs`
- Banner Success: `bg-success-subtle/50`, `border-success-subtle`
- Banner Info: `bg-secondary/50`, `border-secondary`
- Footer: `bg-muted/30`, `border-border`

## Code Example
```tsx
import VoterElectionCard from "@/components/organisms/VoterElectionCard";

<VoterElectionCard
  election={election}
  onVoteSuccess={handleVoteSuccess}
  onViewCandidateDetail={(pair) => setSelectedPair(pair)}
/>
```