# CandidatePairCard Component

- **Level**: Organism
- **Folder**: `src/components/organisms/CandidatePairCard/`

## Purpose

Card representation of a single candidate pair for the admin management view (`CandidatePairPage`). Replaces the previous `DataTable` rows so every piece of information and every action is visible directly on the card without a dropdown menu — following the same concept as `AdminElectionCard` on `ElectionPage`.

Composes `SectionCard` (header/body/footer surface) with:
- a pair photo (or placeholder) via `ImagePreview`,
- compact candidate tiles for the main candidate and the vice candidate (photo or initials fallback),
- an optional **Perolehan Suara** stat tile for Super Admin only (BR-12),
- a clamped shared vision block.

The card is presentational. Data fetching, role checks, delete confirmation, and all modals stay in the page.

## Actions

Actions are rendered as explicit buttons in the card footer:

| Action | Rendered when | Handler |
| :--- | :--- | :--- |
| Lihat Detail | always | `onViewDetail` |
| Edit | always | `onEdit` |
| Hapus | always (backend enforces election scope for Admin) | `onDelete` |

## Props

| Prop | Tipe | Default | Deskripsi |
| :--- | :--- | :--- | :--- |
| `pair` | `CandidatePairListItem` | required | Candidate pair row data, including `election`, `candidate`, `vice`, `photoUrl`, `vision`, and optional `_count.votes`. |
| `isDeleting` | `boolean` | `false` | Shows the delete button spinner and disables it while deletion is in flight. |
| `showVotes` | `boolean` | `false` | When `true`, renders the **Perolehan Suara** stat tile. Pass `true` only for Super Admin (BR-12). |
| `onViewDetail` | `(pair: CandidatePairListItem) => void` | required | Opens the detail modal. |
| `onEdit` | `(pair: CandidatePairListItem) => void` | required | Opens the edit form modal. |
| `onDelete` | `(pair: CandidatePairListItem) => void` | required | Opens the delete confirmation modal. |

## Displayed Information

- Pair title `${candidate.name} & ${vice.name}` and creation date (header).
- Election title as a `Badge` (header).
- Pair photo (`aspect-video`) or an empty-photo placeholder.
- Main candidate and vice candidate tiles: photo or initials fallback, name, and role label.
- Vote count stat tile (Super Admin only).
- Shared vision (clamped to three lines; full vision/mission available in `CandidatePairDetailModal`).

## BR-12 Enforcement

`showVotes` is a defense-in-depth flag for the frontend. The backend (`getAllCandidatePairs`) already strips `_count` for Admin, and the page only passes `showVotes` when `isSuperAdmin()` is true.

## Semantic Tokens Used

- Card: `bg-card`, `border-border`, `text-card-foreground`, `shadow-sm`, `rounded-3xl` (via `SectionCard`)
- Icon accent: `bg-secondary`, `text-primary`, `rounded-xl`
- Candidate tiles / stat tile: `bg-muted/30`, `border-border`
- Vision block: `bg-secondary/40`, `border-border`
- Muted text: `text-muted-foreground`
- Destructive action: `destructive-ghost` button variant (`text-destructive`)

## Code Example

```tsx
import CandidatePairCard from "@/components/organisms/CandidatePairCard";

<CandidatePairCard
  pair={pair}
  isDeleting={isDeletingId === pair.id}
  showVotes={isSuperAdmin}
  onViewDetail={setDetailPair}
  onEdit={handleEdit}
  onDelete={setDeleteConfirmPair}
/>
```
