# CandidateRadioCard Component

- **Level**: Molecule
- **Folder**: `src/components/molecules/CandidateRadioCard/`

## Purpose
Compact, thin horizontal candidate row molecule that functions as an interactive radio selection item within an election card. Displays candidate photo/thumbnail on the left, candidate number badge, name, and short description in the middle, and detail profile button along with the radio selection indicator on the right.

## Props
- `candidate`: `Candidate` - The candidate object.
- `candidateNumber`: `number` - Numerical index of the candidate.
- `isSelected`: `boolean` - Whether this candidate is currently selected as the active radio choice.
- `disabled`: `boolean` (optional) - Disables radio selection if user has already voted in this election.
- `onSelect`: `() => void` - Selection callback.
- `onViewDetail`: `() => void` - Detail modal trigger callback (stops event propagation).

## Layout & Semantic Tokens Used
- Layout: Thin horizontal flex item (`p-3 sm:p-3.5`, thumbnail `w-14 h-14` / `w-16 h-16` on the left)
- Surfaces: `bg-card`, `border-border`, `text-card-foreground`, `hover:bg-accent/40`
- Active State: `bg-secondary/40`, `border-primary`, `ring-primary`
- Radio Indicator: `border-primary`, `bg-primary`, `text-primary-foreground`
- Disabled State: `bg-muted/40`, `opacity-75`

## Code Example
```tsx
import CandidateRadioCard from "@/components/molecules/CandidateRadioCard";

<CandidateRadioCard
  candidate={candidate}
  candidateNumber={1}
  isSelected={selectedCandidateId === candidate.id}
  disabled={hasVoted}
  onSelect={() => setSelectedCandidateId(candidate.id)}
  onViewDetail={() => handleOpenDetail(candidate)}
/>
```

