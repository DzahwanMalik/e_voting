# DeleteAllVotersModal

- **Level**: Organism
- **Folder**: `src/components/organisms/DeleteAllVotersModal/`

## Purpose

Destructive confirmation dialog for the **"Hapus Semua Voter"** bulk operation on the Voter page. Wraps the `<Modal>` molecule and adds a typed confirmation guard before the destructive action can be triggered.

Available **only to Super Admin** (BR-19 — Bulk Voter Deletion). Admin and Voter must never reach this flow.

Per PRD BR-19:

- Removes all `User` records with role `VOTER` and their cascading `ElectionVoter` enrollments.
- Election, candidate, candidate pair, admin assignment, and existing `Vote` records are **not** deleted.
- Because `Vote` is anonymous, votes already cast remain counted in the result even after the voter accounts are gone.

## Props

| Prop | Tipe | Default | Deskripsi |
| :--- | :--- | :--- | :--- |
| `isOpen` | `boolean` | required | Modal visibility |
| `onClose` | `() => void` | required | Dismiss callback |
| `onConfirm` | `() => void` | required | Confirm action handler (runs the bulk delete) |
| `isSubmitting` | `boolean` | `false` | Disables close/backdrop/escape and shows a loading button |
| `voterCount` | `number` | optional | Displays the number of voters that will be deleted (omit when unknown, e.g. a search filter is active) |

## Typed Confirmation Guard

The confirm button is disabled until the user types exactly `HAPUS SEMUA` (case-insensitive, surrounding whitespace ignored). The parent remounts the component via a `key` bound to `isOpen`, so the confirmation input resets every time the modal toggles.

## Layout Sections

| Section | Component | Pattern |
| :--- | :--- | :--- |
| Warning Box | Custom div with `<AlertTriangle>` | Destructive notice + list of impact (what stays, what is deleted) |
| Confirmation Input | `<FormField>` + `<Input>` | Typed confirmation phrase |
| Footer | `<Button>` x2 | Cancel (outline) + Delete All (destructive, guarded) |

## Dependencies

- Atoms: `Button`, `Input`
- Molecules: `FormField`, `Modal`
- Icons: `AlertTriangle`, `Trash2` (from `lucide-react`)

## Semantic Tokens Used

- Warning surface: `border-destructive/30`, `bg-destructive/10`, `text-destructive`
- Text: `text-muted-foreground`, `text-sm`
- Footer surface: `bg-muted/30`, `border-border`
- Confirm button: `variant="destructive"`

## Code Example

```tsx
import DeleteAllVotersModal from "@/components/organisms/DeleteAllVotersModal";

<DeleteAllVotersModal
  isOpen={isDeleteAllOpen}
  voterCount={totalItems}
  isSubmitting={isDeletingAllVoters}
  onClose={() => setIsDeleteAllOpen(false)}
  onConfirm={handleDeleteAllVoters}
/>
```
