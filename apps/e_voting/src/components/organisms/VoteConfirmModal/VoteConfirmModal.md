# VoteConfirmModal Component

- **Level**: Organism
- **Folder**: `src/components/organisms/VoteConfirmModal/`

## Purpose
Confirmation dialog prompt before casting a vote per PRD BR-10 and Section 7. Prevents accidental vote submissions, reinforces the one-vote-per-election rule (One-Vote-Per-Election), and provides loading feedback during atomic vote transaction submission. Displays the selected candidate **pair** (calon + wakil) for clarity.

## Props
- `candidatePair`: `CandidatePair | null` chosen candidate pair
- `electionTitle`: `string` title of the election being voted on
- `isOpen`: `boolean` modal open state
- `isSubmitting`: `boolean` loading status of the vote API submission
- `onClose`: `() => void` modal dismissal callback
- `onConfirm`: `() => void` vote submission handler

## Semantic Tokens Used
- Highlight Box: `bg-secondary/50`, `border-secondary`
- Warning Banner: `bg-warning-subtle/40`, `border-warning-subtle`, `text-warning-subtle-foreground`
- Text: `text-foreground`, `text-secondary-foreground`, `text-muted-foreground`

## Code Example
```tsx
import VoteConfirmModal from "@/components/organisms/VoteConfirmModal";

<VoteConfirmModal
  candidatePair={selectedPair}
  electionTitle={election.title}
  isOpen={isConfirmOpen}
  isSubmitting={isSubmitting}
  onClose={() => setIsConfirmOpen(false)}
  onConfirm={handleConfirmVote}
/>
```