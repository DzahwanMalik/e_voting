# ElectionResultModal Component

- **Level**: Organism
- **Folder**: `src/components/organisms/ElectionResultModal/`

## Purpose
Modal dialog for viewing election result data (turnout, total votes, per-pair vote counts and percentages). Accessible via the Election page datatable "Hasil Voting" row option (Super Admin only per BR-12).

## Props
- `electionId`: `number` - The election ID to fetch results for.
- `electionTitle`: `string` - Title displayed in modal header.
- `isOpen`: `boolean` - Modal open state.
- `onClose`: `() => void` - Modal dismissal handler.

## Internal Usage
Composes the base `<Modal>` molecule (size `"4xl"`), `<StatCard>` for summary stats, `<LoadingState>` and `<EmptyState>` for async states, and `<Button>` for footer close.

## API Integration
Uses `getElectionResultApi` to fetch `ElectionResultData` containing per-candidate-pair vote counts, percentages, turnout, and totals. Access is enforced server-side (Super Admin only); Admin and Voter receive 403.

## Sections
- **Summary Stats**: total voters (`Users` icon), votes cast (`Vote` icon), turnout percentage (`BarChart3` icon)
- **Per-pair results** — vote count, percentage bar, and percentage per candidate pair, sorted by vote count descending
- Each pair row shows calon name and wakil name

## Semantic Tokens Used
- StatCard variants: `secondary`, `info`, `warning`
- Bar: `bg-primary` (filled), `bg-muted` (track)

## Code Example
```tsx
import ElectionResultModal from "@/components/organisms/ElectionResultModal";

<ElectionResultModal
  electionId={election.id}
  electionTitle={election.title}
  isOpen={resultElection !== null}
  onClose={() => setResultElection(null)}
/>
```