# CandidateCard Component

- **Level**: Molecule
- **Folder**: `src/components/molecules/CandidateCard/`

## Purpose
Displays candidate pair cards (calon + wakil) for eligible elections per PRD Section 5. Displays candidate pair photos (calon main photo with initials fallback, wakil secondary photo), names, brief summary description, action to open detailed vision/mission modal, and vote action button. Adheres to BR-10 (One-Vote-Per-Election) by disabling the vote button once `hasVotedInElection` is true.

## Props
- `candidatePair`: `CandidatePair` object (id, electionId, vision, mission, candidate (calon), vice (wakil))
- `hasVotedInElection`: `boolean` whether the current voter has already voted in this election
- `onViewDetail`: `(candidatePair: CandidatePair) => void` handler to view detailed profile
- `onSelectVote`: `(candidatePair: CandidatePair) => void` handler to initiate voting

## Semantic Tokens Used
- Card Surface: `bg-card`, `border-border`, `text-card-foreground`, `hover:border-border-hover`
- Muted Area: `bg-muted`, `text-muted-foreground`
- Badge & Accent: `bg-secondary`, `text-secondary-foreground`, `text-success`
- Button CTA: `bg-primary`, `text-primary-foreground`

## Code Example
```tsx
import CandidateCard from "@/components/molecules/CandidateCard";

<CandidateCard
  candidatePair={pair}
  hasVotedInElection={false}
  onViewDetail={(pair) => setSelectedPair(pair)}
  onSelectVote={(pair) => handleVote(pair)}
/>
```