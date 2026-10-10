# ConfirmModal Component

- **Level**: Molecule
- **Folder**: `src/components/molecules/ConfirmModal/`

## Purpose

General-purpose confirmation dialog that wraps the base `Modal` component. Replaces all `window.confirm()` calls (Aturan 8 — strictly prohibited). Uses the Modal's built-in title with a conditional icon (destructive: `AlertTriangle` in red; non-destructive: `AlertCircle` in amber) and `closeButtonDisabled` for async states.

## Props

| Prop | Tipe | Default | Deskripsi |
| :--- | :--- | :--- | :--- |
| `isOpen` | `boolean` | required | Modal visibility |
| `onClose` | `() => void` | required | Dismiss callback |
| `onConfirm` | `() => void` | required | Confirm action handler |
| `message` | `string` | required | Confirmation message body (no icon) |
| `confirmLabel` | `string` | `"Konfirmasi"` | Confirm button text |
| `cancelLabel` | `string` | `"Batal"` | Cancel button text |
| `isDestructive` | `boolean` | `false` | Uses `destructive` confirm button; title icon is `AlertTriangle` (red), title text is "Konfirmasi Penghapusan" |
| `isSubmitting` | `boolean` | `false` | Disables close/backdrop during async |
| `size` | `ModalSize` | `"md"` | Modal width variant |

## Title & Icon

The header title and left icon are composed internally by the component:

| Mode | Icon | Title Text | Confirm Button Variant |
| :--- | :--- | :--- | :--- |
| Non-destructive | `<AlertCircle>` `text-warning` | `"Konfirmasi"` | `primary` |
| Destructive | `<AlertTriangle>` `text-destructive` | `"Konfirmasi Penghapusan"` | `destructive` |

The message body is plain text — no icon box.

## Code Example

```tsx
import ConfirmModal from "@/components/molecules/ConfirmModal";

<ConfirmModal
  isOpen={isConfirmOpen}
  message={`Apakah Anda yakin ingin menghapus "${election.title}"? Tindakan ini tidak dapat dibatalkan.`}
  confirmLabel="Hapus"
  isDestructive
  onConfirm={handleDelete}
  onClose={() => setIsConfirmOpen(false)}
/>
```
