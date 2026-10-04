# CandidateCard Component

- **Level**: Molecule
- **Folder**: `src/components/molecules/CandidateCard/`

## Purpose
Displays individual candidate cards for eligible elections per PRD Section 5. Displays candidate photo (with stylish initials fallback), candidate serial number badge, name, brief summary description, action to open detailed vision/mission modal, and vote action button. Adheres to BR-10 (One-Vote-Per-Election) by disabling the vote button once `hasVotedInElection` is true.

## Props
- `candidate`: `Candidate` object (id, name, photoUrl, description, birthday, vision, mission)
- `candidateNumber`: `number` ordinal index (e.g. 1, 2, 3)
- `hasVotedInElection`: `boolean` whether the current voter has already voted in this election
- `onViewDetail`: `(candidate: Candidate) => void` handler to view detailed profile
- `onSelectVote`: `(candidate: Candidate) => void` handler to initiate voting

## Semantic Tokens Used
- Card Surface: `bg-card`, `border-border`, `text-card-foreground`, `hover:border-border-hover`
- Muted Area: `bg-muted`, `text-muted-foreground`
- Badge & Accent: `bg-secondary`, `text-secondary-foreground`, `text-success`
- Button CTA: `bg-primary`, `text-primary-foreground`

## Code Example
```tsx
import { CandidateCard } from "@/components/molecules/CandidateCard";

<CandidateCard
  candidate={candidate}
  candidateNumber={1}
  hasVotedInElection={false}
  onViewDetail={(c) => setSelectedCandidate(c)}
  onSelectVote={(c) => handleVote(c)}
/>
```
