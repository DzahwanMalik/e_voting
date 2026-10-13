# CandidatePairFormModal Component

- **Level**: Organism
- **Folder**: `src/components/organisms/CandidatePairFormModal/`

## Purpose

Dialog modal form for creating or editing a **candidate pair** (paslon). Wraps the `<Modal>` molecule and uses **React Hook Form + Zod** for form validation. Follows the same patterns as `VoterFormModal`.

Per PRD Section 5 (Candidate) and §15.3 (Candidate Management), with reference to BR-09 (Candidate Ownership) and BR-15 (Candidate Update):

- **Create mode** (Super Admin + Admin): Allows selecting an election from a dropdown (fetched via `getElectionsApi`), then fills calon/vice details, shared vision/mission, and optional photos. The election dropdown is filtered by the backend to only elections the user can manage.
- **Edit mode** (Super Admin + Admin): Pre-fills all fields from the selected pair.

### Photo Upload Handling

Three photo fields are managed via a local `PairPhotoUploader` sub-component that wraps the shared `FileUpload` molecule (`@/components/molecules/FileUpload`) with an image preview overlay:

| Photo | Source Field | Notes |
| :--- | :--- | :--- |
| Foto Calon | `pair.candidate.photoUrl` | Individual calon profile photo |
| Foto Wakil | `pair.vice.photoUrl` | Individual vice profile photo |
| Foto Pasangan | `pair.photoUrl` | Shared campaign photo |

States per photo:
- **No change** (edit mode, untouched): `file=null, removed=false` → omitted from payload → backend skips
- **New file selected** (via `FileUpload`): `file=<File>` → appended as multipart `File`
- **Marked for removal**: `removed=true` → appended as `"null"` string → backend sets to `null`

Photos are uploaded via Multer + Cloudinary (backend `uploadCandidatePhotos` middleware). The frontend builds `FormData` using the shared `buildCandidatePairFormData` helper (called internally by `createCandidatePairApi`/`updateCandidatePairApi`).

The `PairPhotoUploader` renders:
1. A **preview box** (24×24) showing the existing photo, or initials avatar (`User` icon) when no image
2. A `FileUpload` text-style input for selecting a replacement photo file (with 5MB size limit + image type validation)
3. A **delete button** ("Hapus") that appears only in edit mode when an existing photo URL is present and no new file has been selected — marks the photo for removal from the API on submit
4. A **cancel button** ("Batal") that appears when a removal is pending — undoes the removal state

### Delete Button (Remove Existing Photo)

The delete button (`canDelete` prop) is shown only in **edit mode** when:
- An `existingUrl` is present (photo exists in the API)
- No new file has been selected (`!value.file`)
- Removal hasn't already been triggered (`!value.removed`)

Clicking "Hapus" sets `removed: true` → on form submit, `photoToPayload()` returns `null` → sent to backend as `"null"` → backend deletes the existing image and sets the URL to `null`.

### String Trimming

Per frontend guideline Aturan 7, all string inputs are trimmed before submission (`data.field.trim()`).

## Props

- `mode`: `"create" | "edit"`
- `pair`: `CandidatePair \| null` — the pair to edit (null in create mode)
- `isOpen`: `boolean` modal visibility
- `onClose`: `() => void` dismiss callback
- `onSaved`: `() => void` called after successful create/update to trigger parent refresh

## Form Fields

| Field | Element | Validation | Required? |
| :--- | :--- | :--- | :--- |
| `electionId` | native `<select>` | non-zero number | Create only |
| `candidateName` | `<Input>` | `.min(1)`, trimmed | Yes |
| `candidateBirthday` | `<Input type="date">` | valid date | Yes |
| `candidateDescription` | `<Input>` | optional | No |
| `candidatePhoto` | `PairPhotoUploader` → `FileUpload` | image file, 5MB max | No |
| `viceName` | `<Input>` | `.min(1)`, trimmed | Yes |
| `viceBirthday` | `<Input type="date">` | valid date | Yes |
| `viceDescription` | `<Input>` | optional | No |
| `vicePhoto` | `PairPhotoUploader` → `FileUpload` | image file, 5MB max | No |
| `pairPhoto` | `PairPhotoUploader` → `FileUpload` | image file, 5MB max | No |
| `vision` | `<textarea>` | `.min(1)`, trimmed | Yes |
| `mission` | `<textarea>` | `.min(1)`, trimmed | Yes |

## Semantic Tokens Used

- Form fields: `bg-card`, `text-foreground`, `border-input`, `border-destructive`, `placeholder:text-muted-foreground`, `focus:ring-primary`
- Section headings: `text-muted-foreground`
- Action buttons: `bg-primary`/`text-primary-foreground` (submit), `bg-transparent`/`text-foreground` (cancel)
- Photo preview: `bg-muted`, `border-border`, `rounded-2xl`, `object-cover`, `object-top`
- Delete button: `text-destructive` with `hover:bg-destructive/10`
- Cancel removal button: `border-destructive` + `text-destructive` with `hover:bg-destructive/10`

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
