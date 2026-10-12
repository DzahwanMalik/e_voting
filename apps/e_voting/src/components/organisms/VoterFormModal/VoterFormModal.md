# VoterFormModal

- **Level**: Organism
- **Folder**: `src/components/organisms/VoterFormModal/`

## Purpose

Dialog modal form for creating or editing a Voter. Replaces inline form UI and wraps the `<Modal>` molecule. Uses React Hook Form + Zod for text-field validation, and manual checkbox state for election enrollment selection in both create and edit modes. On edit-mode submit, election changes are diffed against the original selections and applied via `enrollVoterToElectionsApi` (additions) and `removeVoterFromElectionApi` (removals), with backend enforcement of BR-08 (Admin creator scope) and BR-16 (vote-safe voter removal).

Per PRD Section 15.4 (Voter Management) and BR-07/BR-08:

- **Super Admin**: Can create voters and optionally enroll them in any election. Can edit any voter's name, username, and password.
- **Admin**: Can create voters and optionally enroll them in elections they manage. Can edit voters they created; the backend enforces creator-scope (BR-08).

### Mode Behavior

| Mode | Fields | Election Selection |
| :--- | :--- | :--- |
| `create` | username (required), name (required), password (required, min 6) | Shown — multi-checkbox from `getElectionsApi()`; selected elections sent on create |
| `edit` | username (required), name (required), password (optional) | Shown — multi-checkbox from `getElectionsApi()`; pre-checked with voter's current election assignments; changes diffed and applied via `enrollVoterToElectionsApi` (add) + `removeVoterFromElectionApi` (remove) |

### Edit-Mode Election Management

In **edit mode**, the component tracks the original election selections (`originalElectionIds`) when the modal opens. On submit:

1. The voter's core data (username, name, optional password) is updated via `updateVoterApi`.
2. **Election changes are computed** by diffing `selectedElectionIds` against `originalElectionIds`:
   - **Additions** (checked but were not originally enrolled) → `POST /voters/:id/elections` (`enrollVoterToElectionsApi`)
   - **Removals** (unchecked but were originally enrolled) → `DELETE /voters/:id/elections/:electionId` (`removeVoterFromElectionApi`), called one-by-one
3. The backend enforces BR-08 (Admin creator scope) and BR-16 (voter can be removed even after voting — vote records remain).

**Super Admin** can enroll a voter to any election. **Admin** can only enroll/remove the voter to/from elections they manage (backend enforces this).

Pre-checked elections show a **"Terdaftar"** success badge for visual clarity.

## Props

| Prop | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `mode` | `"create" \| "edit"` | Form mode controls field requirements and title |
| `voter` | `VoterListItem \| null` | Voter data for edit mode; `null` in create mode |
| `isOpen` | `boolean` | Modal visibility |
| `onClose` | `() => void` | Dismiss callback (disabled while submitting) |
| `onSaved` | `() => void` | Called after successful create/update — triggers parent to refetch list |

## Form Fields

| Field | Type | Validation | Create Mode | Edit Mode |
| :--- | :--- | :--- | :--- | :--- |
| Username | text | min 1, trim | Required | Required |
| Nama Lengkap | text | min 1, trim | Required | Required |
| Password | password | min 6 (when provided) | Required | Optional (empty = no change) |
| Election selection | checkboxes | multi-select | Optional | N/A |

## Dependencies

- Atoms: `Button`, `Input`, `Checkbox`
- Molecules: `FormField`, `Modal`, `LoadingState`, `EmptyState`
- Services: `createVoterApi`, `updateVoterApi` (from `@/services/voter.service`), `getElectionsApi` (from `@/services/election.service`), `enrollVoterToElectionsApi`, `removeVoterFromElectionApi` (from `@/services/voter.service`)
- Schema: `voterFormSchema` (Zod), `VoterFormData` (inferred type)
- Libraries: `react-hook-form` (`useForm`, `zodResolver`)

## Semantic Tokens Used

- Modal container: `bg-card`, `border-border`, `rounded-3xl`, `shadow-xl`
- Form text: `text-foreground`, `text-muted-foreground`
- Footer: `bg-muted/30`, `border-border`
- Election row: `border-border`, `hover:bg-accent`
- Error text: `text-destructive`

## Code Example

```tsx
import VoterFormModal, { type VoterFormModalProps } from "@/components/organisms/VoterFormModal";

<VoterFormModal
  mode="create"
  voter={null}
  isOpen={isFormOpen}
  onClose={() => setFormOpen(false)}
  onSaved={handleRefetch}
/>

<VoterFormModal
  mode="edit"
  voter={selectedVoter}
  isOpen={isFormOpen}
  onClose={() => setFormOpen(false)}
  onSaved={handleRefetch}
/>
```
