# ImageUpload Component

- **Level**: Molecule
- **Folder**: `src/components/molecules/ImageUpload/`

## Purpose

Controlled image uploader with thumbnail preview for candidate photos. Composes
the `ImagePreview` molecule, so clicking the thumbnail opens the full-size
lightbox before the form is submitted.

Unlike the generic `FileUpload` molecule (used for Excel imports), `ImageUpload`
knows about an existing remote image and the three possible update states:
keep, replace, or remove.

## Props

- `id`: `string` — id for the hidden file input and label association.
- `label`: `string` — field label.
- `value`: `ImageUploadValue` — `{ file: File | null; removed: boolean }`.
- `onChange`: `(value: ImageUploadValue) => void` — controlled state callback.
- `existingUrl`: `string | null` (optional) — current image URL from the API.
- `accept`: `string` (optional, default `"image/jpeg,image/png,image/gif,image/webp"`).
- `maxSize`: `number` (optional, default `5 * 1024 * 1024`).
- `disabled`: `boolean` (optional, default `false`).
- `optional`: `boolean` (optional, default `false`) — shows the "(optional)" marker.
- `hint`: `string` (optional) — overrides the default format/size hint.
- `className`: `string` (optional) — wrapper classes.
- `onError`: `(message: string) => void` (optional) — called when validation fails.

## Behavior

- Preview priority: newly selected file (object URL) → existing URL → empty placeholder.
- Object URLs are created with `URL.createObjectURL()` and revoked on change/unmount.
- Clicking the thumbnail opens the `ImagePreview` lightbox with the full image
  (`object-contain`), even for a file that has not been uploaded yet.
- Actions:
  - **Pilih Foto / Ganti Foto** — opens the native file picker.
  - **Batalkan** — shown when a new file is selected; reverts to the existing photo.
  - **Hapus** — shown when an existing photo is present and no new file is selected;
    sets `removed: true`.
  - **Batalkan Hapus** — shown after marking an existing photo for removal.
- Client-side validation uses the shared `validateFile()` / `formatBytes()`
  utilities from `@/lib/utils` (max size + MIME/extension check).
- Validation errors are shown with `role="alert"` and wired through
  `aria-describedby`; the hidden input is not in the tab order, so the action
  buttons drive the interaction.

## State Contract

| State | `file` | `removed` | Meaning |
| :--- | :--- | :--- | :--- |
| Untouched (edit) | `null` | `false` | Keep the existing photo |
| New file | `File` | `false` | Replace the photo |
| Removed | `null` | `true` | Delete the existing photo on submit |
| Create, no photo | `null` | `false` | No photo |

## Semantic Tokens Used

- Label: `text-muted-foreground`
- Thumbnail/placeholder surface: `bg-muted`, `bg-muted/40`, `border-border`
- Text: `text-foreground`, `text-muted-foreground`
- Remove action: `text-destructive`, `hover:bg-destructive/10`
- Error: `text-destructive`
- Focus ring: `focus:ring-ring` (via `ImagePreview` and `Button`)

## Code Example

```tsx
import { useState } from "react";
import ImageUpload, {
  type ImageUploadValue,
} from "@/components/molecules/ImageUpload";

const [photo, setPhoto] = useState<ImageUploadValue>({
  file: null,
  removed: false,
});

<ImageUpload
  id="candidatePhoto"
  label="Foto Calon"
  value={photo}
  onChange={setPhoto}
  existingUrl={pair?.candidate.photoUrl ?? null}
  disabled={isSubmitting}
  optional
/>;
```
