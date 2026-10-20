# AdminElectionCard Component

- **Level**: Organism
- **Folder**: `src/components/organisms/AdminElectionCard/`

## Purpose

Card representation of a single election for the admin management view (`ElectionPage`). Replaces the previous table row so every piece of information and every management action is visible directly on the card without opening a dropdown menu.

Composes `SectionCard` (header/body/footer surface) with compact stat tiles, a participation progress block, and — for Super Admin — an inline **Hasil Voting** chart (`VoteResultChart`). Results are no longer opened in a modal.

The card is presentational apart from the Super Admin result fetch. Modals, delete confirmation, loading of the election list, and role checks stay in the page.

## Result Chart

When `showResult` is `true` (Super Admin only, per PRD BR-12), the card fetches `getElectionResultApi(election.id)` and renders:

- `LoadingState` while fetching.
- `VoteResultChart` with per-pair vote counts/percentages when results exist.
- An inline "Belum Ada Suara" state when no votes have been cast.
- An inline "Gagal Memuat Hasil" state if the request fails (a toast is also shown).

Admin never receives `showResult`, so the request is not made and the chart is not rendered.

## Actions

Actions are rendered as explicit buttons in the card footer:

| Action | Rendered when | Handler |
| :--- | :--- | :--- |
| Lihat Detail | always | `onViewDetail` |
| Edit | always | `onEdit` |
| Import Voter | `onImportVoters` provided (Admin & Super Admin) | `onImportVoters` |
| Penugasan Admin | `onManageAdmins` provided (Super Admin) | `onManageAdmins` |
| Hapus | `onDelete` provided (Super Admin) | `onDelete` |

## Props

| Prop | Tipe | Default | Deskripsi |
| :--- | :--- | :--- | :--- |
| `election` | `ElectionListItem` | required | Election row data, including `_count`, `votedCount`, `unvotedCount`, `electionAdmins`, and `candidatePairs`. |
| `isDeleting` | `boolean` | `false` | Shows the delete button spinner and disables it while deletion is in flight. |
| `showResult` | `boolean` | `false` | Fetches and renders the inline result chart. Pass `true` only for Super Admin (BR-12). |
| `refreshKey` | `number` | `0` | Change this value to re-fetch the result chart (e.g., after import/refresh). |
| `onViewDetail` | `(election: ElectionListItem) => void` | required | Opens the detail modal. |
| `onEdit` | `(election: ElectionListItem) => void` | required | Opens the edit form modal. |
| `onImportVoters` | `(election: ElectionListItem) => void` | optional | Opens the `ImportVotersModal` for this election. Rendered only when provided; the page passes it for both Admin and Super Admin. |
| `onDelete` | `(election: ElectionListItem) => void` | optional | Rendered only when provided (Super Admin). |
| `onManageAdmins` | `(election: ElectionListItem) => void` | optional | Rendered only when provided (Super Admin). |

## Displayed Information

- Election title and creation date (header).
- Description (clamped to two lines).
- Candidate pair count, assigned voter count, and assigned admin count as stat tiles.
- Participation block: voted/unvoted counts, turnout percentage, and a `bg-success` progress bar.
- Inline result chart (Super Admin only).

## Semantic Tokens Used

- Card: `bg-card`, `border-border`, `text-card-foreground`, `shadow-sm`, `rounded-3xl` (via `SectionCard`)
- Icon accent: `bg-secondary`, `text-primary`, `rounded-xl`
- Stat tiles / participation surface: `bg-muted/30`, `border-border`
- Progress track: `bg-border`; progress fill: `bg-success`
- Chart: `bg-primary`, `bg-success` (leader), `border-border`
- Muted text: `text-muted-foreground`
- Destructive action: `destructive-ghost` button variant (`text-destructive`)

## Code Example

```tsx
import AdminElectionCard from "@/components/organisms/AdminElectionCard";

<AdminElectionCard
  election={election}
  isDeleting={isDeletingId === election.id}
  showResult={isSuperAdmin}
  refreshKey={refreshKey}
  onViewDetail={setDetailElection}
  onEdit={handleEditElection}
  onImportVoters={setImportVotersElection}
  onDelete={isSuperAdmin ? setDeleteConfirmElection : undefined}
  onManageAdmins={isSuperAdmin ? setAdminAssignmentElection : undefined}
/>
```
