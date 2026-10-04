# CandidateDetailModal Component

- **Level**: Organism
- **Folder**: `src/components/organisms/CandidateDetailModal/`

## Purpose
Dialog modal displaying complete candidate details per PRD Section 5. Displays formatted candidate birth date, full vision, and mission without revealing confidential candidate vote totals (per BR-12). Provides shortcut action to initiate vote selection directly from the modal view.

## Props
- `candidate`: `Candidate | null` the candidate whose profile is being viewed
- `isOpen`: `boolean` modal open state
- `hasVotedInElection`: `boolean` whether current voter has voted in the active election
- `onClose`: `() => void` modal dismissal callback
- `onVote`: `(candidate: Candidate) => void` callback to initiate voting for this candidate

## Semantic Tokens Used
- Backdrop: `bg-foreground/40`, `backdrop-blur-xs`
- Modal Surface: `bg-card`, `border-border`, `text-card-foreground`, `shadow-xl`, `rounded-3xl`
- Vision Box: `bg-secondary/40`, `border-secondary`
- Mission Box: `bg-muted`, `border-border`
- Badges & Icons: `text-primary`, `bg-info`

## Code Example
```tsx
import { CandidateDetailModal } from "@/components/organisms/CandidateDetailModal";

<CandidateDetailModal
  candidate={selectedCandidate}
  isOpen={isModalOpen}
  hasVotedInElection={hasVoted}
  onClose={() => setIsModalOpen(false)}
  onVote={(candidate) => handleVote(candidate)}
/>
```
