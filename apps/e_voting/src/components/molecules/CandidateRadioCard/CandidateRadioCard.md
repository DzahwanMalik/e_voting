# CandidateRadioCard Component

- **Level**: Molecule
- **Folder**: `src/components/molecules/CandidateRadioCard/`

## Purpose
Compact, thin horizontal candidate pair row molecule that functions as an interactive radio selection item within an election card. Displays the pair-level campaign photo (`CandidatePair.photoUrl`) on the left, both candidate names (calon + wakil) in the middle, and a detail profile button along with the radio selection indicator on the right. Does not display description text to keep the row compact.

The pair photo uses the `ImagePreview` molecule: clicking the thumbnail opens a full-size lightbox without selecting the radio card (the preview click stops propagation). If the photo is missing or fails to load, it falls back to the combined initials of both candidates.

## Props
- `candidatePair`: `CandidatePair` - The candidate pair object containing calon and wakil.
- `isSelected`: `boolean` - Whether this candidate pair is currently selected as the active radio choice.
- `disabled`: `boolean` - Whether the radio card is disabled (e.g., after voting).
- `onSelect`: `() => void` - Handler when this pair is selected.
- `onViewDetail`: `() => void` - Handler to view detailed pair profile.

## Semantic Tokens Used
- Selected: `bg-secondary/40`, `border-primary`, `ring-2`, `ring-primary`, `shadow-xs`
- Default: `bg-card`, `border-border`, `hover:border-border-hover`, `hover:bg-accent/40`
- Disabled: `opacity-75`, `cursor-not-allowed`
- Name: `text-card-foreground`
- Description: `text-muted-foreground`
- Photo frame: `border-border`, `bg-muted` (via `ImagePreview`)
- Photo fallback: `bg-secondary/50`, `text-secondary-foreground`, `border-border`
- Photo hover overlay: `bg-foreground/40`, `text-background`
- Full preview lightbox: `bg-foreground/80`, `bg-card`, `text-foreground`

## Code Example
```tsx
import CandidateRadioCard from "@/components/molecules/CandidateRadioCard";

<CandidateRadioCard
  candidatePair={pair}
  isSelected={selectedPairId === pair.id}
  disabled={hasVoted}
  onSelect={() => setSelectedPairId(pair.id)}
  onViewDetail={() => handleOpenDetail(pair)}
/>
```