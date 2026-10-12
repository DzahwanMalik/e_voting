# CandidateDetailModal Component

- **Level**: Organism
- **Folder**: `src/components/organisms/CandidateDetailModal/`

## Purpose
Dialog modal displaying complete candidate **pair** details (calon + wakil) per PRD Section 5. Displays formatted candidate pair birth dates, full shared vision, and mission without revealing confidential candidate vote totals (per BR-12). Shows both calon (main candidate) and wakil (vice candidate) profiles with their **individual photos** (`calon.photoUrl` and `vice.photoUrl`), names, birthdays, and descriptions. Provides shortcut action to initiate vote selection directly from the modal view.

## Props
- `candidatePair`: `CandidatePair | null` the candidate pair whose profile is being viewed
- `isOpen`: `boolean` modal open state
- `hasVotedInElection`: `boolean` whether current voter has voted in the active election
- `onClose`: `() => void` modal dismissal callback
- `onVote`: `(candidatePair: CandidatePair) => void` callback to initiate voting for this pair

## Semantic Tokens Used
- Backdrop: `bg-foreground/40`, `backdrop-blur-xs`
- Modal Surface: `bg-card`, `border-border`, `text-card-foreground`, `shadow-xl`, `rounded-3xl`
- Vision Box: `bg-secondary/40`, `border-secondary`
- Mission Box: `bg-muted`, `border-border`
- Badges & Icons: `text-primary`, `bg-info`

## Code Example
```tsx
import CandidateDetailModal from "@/components/organisms/CandidateDetailModal";

<CandidateDetailModal
  candidatePair={selectedPair}
  isOpen={isModalOpen}
  hasVotedInElection={hasVoted}
  onClose={() => setIsModalOpen(false)}
  onVote={(pair) => handleVote(pair)}
/>
```