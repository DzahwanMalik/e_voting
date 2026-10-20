# VoterElectionCard Component

- **Level**: Organism
- **Folder**: `src/components/organisms/VoterElectionCard/`

## Purpose
Comprehensive card container representing a single election per voter requirements. Encapsulates the election title and description, a status notice banner communicating the voter's voting state (Hak Suara Telah Digunakan / Pilih Paslon Kandidat Anda), a candidate pair list rendered as interactive radio cards, and a dedicated footer containing chosen-pair feedback and the "Kirim Suara" submission button with confirmation dialog. The voter's voting status is surfaced via the banner and footer rather than a separate vote-status badge, and the election creation date is intentionally not displayed to voters.

## Props
- `election`: `ElectionListItem` - The election data including candidate pairs (`candidatePairs`) and `electionVoters` hasVoted state.
- `onVoteSuccess`: `(electionId: number) => void` - Callback fired after a successful vote submission. `VoterDashboard` may use this to trigger automatic logout when the voter only has one election.
- `onViewCandidateDetail`: `(candidatePair: CandidatePair) => void` - Callback to view full candidate pair details.

## Notes on View Layout
- All candidate pairs are rendered as radio list items for consistent, single-selection voting regardless of the number of elections.
- Each pair row (`CandidateRadioCard`) shows the pair-level campaign photo (`CandidatePair.photoUrl`) with initials fallback; clicking the photo opens a full-size `ImagePreview` lightbox without changing the radio selection. Individual candidate/vice photos are shown in the detail modal.
- When the election list response does not include candidate pairs, the card lazily fetches them via `getElectionByIdApi`.

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