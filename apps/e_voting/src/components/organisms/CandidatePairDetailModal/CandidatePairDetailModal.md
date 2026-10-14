# CandidatePairDetailModal Component

- **Level**: Organism
- **Folder**: `src/components/organisms/CandidatePairDetailModal/`

## Purpose

Dialog modal displaying complete candidate **pair** details (calon + wakil) per PRD Section 5. Displays formatted candidate pair birth dates, full shared vision, and mission without revealing confidential candidate vote totals (per BR-12). Shows both calon (main candidate) and wakil (vice candidate) profiles with their **individual photos** (`candidate.photoUrl` and `vice.photoUrl`), names, birthdays, and descriptions, plus the shared pair photo (`pairPhotoUrl`), vision, and mission.

This is a **general-purpose inspection modal** — it renders read-only pair details with no action buttons. Voting is initiated separately via the `VoteConfirmModal` from `CandidateRadioCard` (within `VoterElectionCard`), and management actions (edit/delete) are handled by the admin `CandidatePairPage` modals.

## Props

- `candidatePair`: `CandidatePair | null` the candidate pair whose profile is being viewed
- `isOpen`: `boolean` modal open state
- `onClose`: `() => void` modal dismissal callback

## Semantic Tokens Used

- Backdrop: `bg-foreground/40`, `backdrop-blur-xs`
- Modal Surface: `bg-card`, `border-border`, `text-card-foreground`, `shadow-xl`, `rounded-3xl`
- Vision Box: `bg-secondary/40`, `border-secondary`
- Mission Box: `bg-muted`, `border-border`
- Avatar Fallback: `bg-muted`, `border-border`
- Badges & Icons: `text-primary`

## Code Example

```tsx
import CandidatePairDetailModal from "@/components/organisms/CandidatePairDetailModal";

<CandidatePairDetailModal
  candidatePair={selectedPair}
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
/>;
```
