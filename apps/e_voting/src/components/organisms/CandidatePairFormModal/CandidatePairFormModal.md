# CandidatePairFormModal Component

- **Level**: Organism
- **Folder**: `src/components/organisms/CandidatePairFormModal/`

## Purpose

Dialog modal form for creating or editing a **candidate pair** (paslon). Wraps the `<Modal>` molecule and uses **React Hook Form + Zod** for form validation, plus the `<Select>` molecule (from `@/components/molecules/Select`) for the election dropdown and the `<DatePicker>` molecule (from `@/components/molecules/DatePicker`) for birthday fields. Follows the same patterns as `VoterFormModal`.

Per PRD Section 5 (Candidate) and §15.3 (Candidate Management), with reference to BR-09 (Candidate Ownership) and BR-15 (Candidate Update):

- **Create mode** (Super Admin + Admin): Allows selecting an election from a dropdown (fetched via `getElectionsApi`), then fills calon/vice details, shared vision/mission, and optional photos. The election dropdown is filtered by the backend to only elections the user can manage.
- **Edit mode** (Super Admin + Admin): Pre-fills all fields from the selected pair row. **No election list is fetched** — the pair already belongs to an election and the backend does not allow moving a pair between elections. The pair's election is displayed read-only (`pair.election.title`) for context.

### Photo Upload Handling

Three photo fields are managed via the shared `ImageUpload` molecule (`@/components/molecules/ImageUpload`):

| Photo | Source Field | Notes |
| :--- | :--- | :--- |
| Foto Calon | `pair.candidate.photoUrl` | Individual calon profile photo |
| Foto Wakil | `pair.vice.photoUrl` | Individual vice profile photo |
| Foto Pasangan | `pair.photoUrl` | Shared campaign photo |

States per photo (`ImageUploadValue`):
- **No change** (edit mode, untouched): `file=null, removed=false` → omitted from payload → backend skips
- **New file selected**: `file=<File>` → appended as multipart `File`
- **Marked for removal**: `removed=true` → appended as `"null"` string → backend sets to `null`

Photos are uploaded via Multer + Cloudinary (backend `uploadCandidatePhotos` middleware). The frontend builds `FormData` using the shared `buildCandidatePairFormData` helper (called internally by `createCandidatePairApi`/`updateCandidatePairApi`).

The `ImageUpload` renders:
1. A **label** for the photo field
2. A **thumbnail preview** (existing remote photo or newly selected file). Clicking it opens the full-size `ImagePreview` lightbox.
3. File metadata (name + size for a new file, or "Foto saat ini")
4. **Pilih Foto / Ganti Foto**, **Batalkan** (when a new file is selected), and **Hapus / Batalkan Hapus** (for an existing photo) actions

Client-side validation: 5 MB max, `image/jpeg`, `image/png`, `image/gif`, `image/webp`.

### Photo Removal

"Hapus" is shown when an `existingUrl` is present and no new file is selected. Clicking it sets `removed: true` → on form submit, `photoToPayload()` returns `null` → sent to backend as `"null"` → backend sets the URL to `null`. After removal is marked, the UI offers **Batalkan Hapus** to restore the existing photo without leaving the modal.

### Date Fields (DatePicker)

`candidateBirthday` and `viceBirthday` use the `DatePicker` molecule instead of a native `<input type="date">`:

- The trigger is read-only (calendar popover) — users select the day, month, and year from the popover; they cannot type into it.
- Both fields are bound through React Hook Form's `<Controller>` because `DatePicker` is a controlled component (`value` + `onChange`).
- The API returns `birthday` as an ISO datetime (e.g. `1990-05-20T00:00:00.000Z`). On edit, the value is normalized with `toDateInputValue()` from `@/lib/utils` before `reset()`, so the picker receives the required `YYYY-MM-DD` format and displays the existing birthday.

### String Trimming

Per frontend guideline Aturan 7, all string inputs are trimmed before submission (`data.field.trim()`).

## Imports

- `<Select>` molecule from `@/components/molecules/Select` — custom dropdown with internal popover UI for the election dropdown (Create mode only). Parent passes `options` array; all dropdown open/close, positioning, and click-outside behavior are handled internally.
- `<Input>` atom from `@/components/atoms/Input` — for text fields.
- `<DatePicker>` molecule from `@/components/molecules/DatePicker` — calendar-popover birthday selection (read-only trigger, no typing).
- `<FormField>` molecule from `@/components/molecules/FormField` — label + error/hint wrapper.
- `<ImageUpload>` molecule from `@/components/molecules/ImageUpload` — photo selection, thumbnail preview, and remove/undo actions (composes `ImagePreview`).
- `<Modal>` molecule from `@/components/molecules/Modal` — dialog container.
- `<LoadingState>` / `<EmptyState>` molecules — election dropdown loading and empty states.

## Props

- `mode`: `"create" | "edit"`
- `pair`: `CandidatePairListItem \| null` — the pair row to edit (null in create mode); includes optional `election { id, title }` used for the read-only election info in edit mode
- `isOpen`: `boolean` modal visibility
- `onClose`: `() => void` dismiss callback
- `onSaved`: `() => void` called after successful create/update to trigger parent refresh

## Form Fields

| Field | Element | Validation | Required? |
| :--- | :--- | :--- | :--- |
| `electionId` | `<Select>` atom (create) / read-only info (edit) | non-zero number | Create only |
| `candidateName` | `<Input>` | `.min(1)`, trimmed | Yes |
| `candidateBirthday` | `<DatePicker>` | valid date (`YYYY-MM-DD`) | Yes |
| `candidateDescription` | `<Input>` | optional | No |
| `candidatePhoto` | `<ImageUpload>` | image file, 5MB max | No |
| `viceName` | `<Input>` | `.min(1)`, trimmed | Yes |
| `viceBirthday` | `<DatePicker>` | valid date (`YYYY-MM-DD`) | Yes |
| `viceDescription` | `<Input>` | optional | No |
| `vicePhoto` | `<ImageUpload>` | image file, 5MB max | No |
| `pairPhoto` | `<ImageUpload>` | image file, 5MB max | No |
| `vision` | `<textarea>` | `.min(1)`, trimmed | Yes |
| `mission` | `<textarea>` | `.min(1)`, trimmed | Yes |

## Semantic Tokens Used

- Form fields: `bg-card`, `text-foreground`, `border-input`, `border-destructive`, `placeholder:text-muted-foreground`, `focus:ring-primary`
- Section headings: `text-muted-foreground`
- Action buttons: `bg-primary`/`text-primary-foreground` (submit), `bg-transparent`/`text-foreground` (cancel)
- Photo label & hint: `text-muted-foreground`
- Photo preview/placeholder: `bg-muted`, `bg-muted/40`, `border-border`
- Delete action: `text-destructive`, `hover:bg-destructive/10`
- Photo lightbox: `bg-foreground/80`, `bg-card`, `text-foreground`

## Code Example

```tsx
import CandidatePairFormModal from "@/components/organisms/CandidatePairFormModal";

<CandidatePairFormModal
  mode="create"
  pair={null}
  isOpen={isFormOpen}
  onClose={() => setIsFormOpen(false)}
  onSaved={() => setRefreshKey((k) => k + 1)}
/>

<CandidatePairFormModal
  mode="edit"
  pair={selectedPair}
  isOpen={isFormOpen}
  onClose={() => setIsFormOpen(false)}
  onSaved={() => setRefreshKey((k) => k + 1)}
/>
```
