# VoteConfirmModal Component

- **Level**: Organism
- **Folder**: `src/components/organisms/VoteConfirmModal/`

## Purpose
Confirmation dialog prompt before casting a vote per PRD BR-10 and Section 7. Prevents accidental vote submissions, reinforces the one-vote-per-election rule, and provides loading feedback during atomic vote transaction submission.

## Props
- `candidate`: `Candidate | null` chosen candidate
- `electionTitle`: `string` title of active election
- `isOpen`: `boolean` modal visibility
- `isSubmitting`: `boolean` loading status of the vote API submission
- `onClose`: `() => void` cancel / dismiss callback
- `onConfirm`: `() => void` vote submission handler

## Semantic Tokens Used
- Modal Surface: `bg-card`, `border-border`, `text-card-foreground`, `shadow-xl`, `rounded-3xl`
- Warning Banner: `bg-warning-subtle`, `text-warning-subtle-foreground`, `text-warning`
- Candidate Highlight: `bg-secondary`, `text-secondary-foreground`, `border-secondary`
- Primary CTA: `bg-primary`, `text-primary-foreground`

## Code Example
```tsx
import VoteConfirmModal from "@/components/organisms/VoteConfirmModal";

<VoteConfirmModal
  candidate={selectedCandidate}
  electionTitle="Pemilihan Ketua 2026"
  isOpen={isConfirmOpen}
  isSubmitting={isVoting}
  onClose={() => setIsConfirmOpen(false)}
  onConfirm={handleConfirmVote}
/>
```

