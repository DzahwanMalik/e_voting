# ElectionResultModal Component

- **Level**: Organism
- **Folder**: `src/components/organisms/ElectionResultModal/`

## Purpose

Modal dialog for Super Admin to view vote results for a specific election. Replaces the standalone Hasil Voting navigation menu — now triggered via the Election page datatable option menu (PRD Section 9, BR-12).

Uses `getElectionResultApi` to fetch `ElectionResultData` containing per-candidate vote counts, percentages, turnout, and totals. Access is enforced server-side (Super Admin only); Admin and Voter receive 403.

This component composes the base `<Modal>` molecule (size `"4xl"`) for backdrop/escape-key/visibility handling, the `<EmptyState>` molecule for no-data conditions, and the `<StatCard>` molecule for summary stat cards (Total Pemilih, Suara Masuk, Tingkat Partisipasi). The Modal's built-in title (`"Hasil Voting"`) and close button are used with no custom overrides.

## Props

| Prop | Tipe | Deskripsi |
|---|---|---|
| `electionId` | `number` | ID of the election to fetch results for |
| `electionTitle` | `string` | Election title shown in the modal header |
| `isOpen` | `boolean` | Controls modal visibility |
| `onClose` | `() => void` | Callback to close the modal |

## Displayed Data

- **Total Pemilih** — number of registered voters
- **Suara Masuk** — number of voters who have cast a vote
- **Tingkat Partisipasi** — turnout percentage (votedCount / totalVoters)
- **Per-candidate results** — vote count, percentage bar, and percentage per candidate, sorted by vote count descending

## Semantic Tokens Used

- Modal Surface: `bg-card`, `border-border`, `text-card-foreground`, `rounded-3xl`
- Stat Cards: `bg-secondary/30`, `border-secondary`, `bg-info-subtle/30`, `bg-warning-subtle/30`
- Progress Bar: `bg-primary` (fill), `bg-muted` (track)
- Candidate Rows: `font-sans font-semibold text-foreground`

## Code Example

```tsx
import ElectionResultModal from "@/components/organisms/ElectionResultModal";

<ElectionResultModal
  electionId={1}
  electionTitle="Pemilihan Ketua RT 2026"
  isOpen={isResultOpen}
  onClose={() => setIsResultOpen(false)}
/>
```
