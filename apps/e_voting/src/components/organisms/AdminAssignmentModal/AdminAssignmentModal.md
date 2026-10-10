# AdminAssignmentModal Component

- **Level**: Organism
- **Folder**: `src/components/organisms/AdminAssignmentModal/`

## Purpose

Modal dialog for Super Admin to manage admin assignments for a specific election. Replaces the standalone Penugasan Admin navigation menu — now triggered via the Election page datatable option menu (PRD Section 4, BR-06).

Uses `getAllAdminsApi` (list all ADMIN users) and `getElectionAdminsApi` (current assignments), with `assignAdminsApi` and `removeAdminApi` for mutations.

This component composes the base `<Modal>` molecule (size `"2xl"`) for backdrop/escape-key/visibility handling, the `<Input>` atom for the search bar, and the `<EmptyState>` molecule for the no-results condition. The Modal's built-in title (`"Penugasan Admin"`) and close button are used; `closeButtonDisabled` is set during async saves. The `Badge` atom is still used in the admin list for the "Ditugaskan" status indicator.

## Props

| Prop | Tipe | Deskripsi |
|---|---|---|
| `electionId` | `number` | ID of the election to manage admins for |
| `electionTitle` | `string` | Election title shown in the modal header |
| `isOpen` | `boolean` | Controls modal visibility |
| `onClose` | `() => void` | Callback to close the modal |

## Behavior

- On open, fetches all admin users and current election admins in parallel.
- Pre-checks checkboxes for already-assigned admins.
- Search filter by username or name.
- On Save: assigns newly-selected admins and removes deselected ones.
- Destructive action (removal) is confirmed via save action, not per-row.

## Semantic Tokens Used

- Modal Surface: `bg-card`, `border-border`, `text-card-foreground`, `rounded-3xl`
- Info Badge: `bg-info-subtle`, `text-info-subtle-foreground`
- Input: `border-input`, `bg-background`, `focus:ring-ring`
- Hover: `hover:bg-accent`

## Code Example

```tsx
import AdminAssignmentModal from "@/components/organisms/AdminAssignmentModal";

<AdminAssignmentModal
  electionId={1}
  electionTitle="Pemilihan Ketua RT 2026"
  isOpen={isAdminAssignmentOpen}
  onClose={() => setIsAdminAssignmentOpen(false)}
/>
```
