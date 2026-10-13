# Modal Component

- **Level**: Molecule
- **Folder**: `src/components/molecules/Modal/`

## Purpose

General-purpose modal dialog container that handles backdrop overlay, click-to-close, escape key dismissal, size variants, and a built-in title header with close button. Used as the foundation for all modal organisms (`CandidateDetailModal`, `CandidatePairFormModal`, `VoteConfirmModal`, `AdminAssignmentModal`, `ElectionResultModal`) and `ConfirmModal`. Not used directly in pages — composed by organism-level modal components.

### Scrollable Body

The modal container uses `overflow-y-auto` with `max-h-[90vh]`, allowing content that exceeds the viewport height to scroll smoothly. The header bar (`title` prop) always has `shrink-0 sticky top-0 z-10` with a solid `bg-card` background so it stays pinned at the top during scroll — consumers only need to use `flex-1 overflow-y-auto` on their scrollable body section and `shrink-0` on the footer to achieve a pinned-header / scroll-body / pinned-footer layout.

### Scrollable Content Pattern

When composing a `<Modal>` with a `title`, structure children as a flex column: form with `flex flex-1 flex-col`, body with `p-6 overflow-y-auto flex-1 scrollbar-none`, and footer with `shrink-0`:

### Hidden Scrollbar

The Modal container includes the `scrollbar-none` utility (defined in `global.css`) to hide the native scrollbar in Chrome/Safari/Firefox while preserving full scroll functionality (mouse wheel, track pad, keyboard). Consumers should also add `scrollbar-none` to their scrollable body sections. Nested scrollable areas like election lists keep their visible scrollbar for discoverability.

## Props

| Prop                   | Tipe         | Default     | Deskripsi                                                                                              |
| ---------------------- | ------------ | ----------- | ------------------------------------------------------------------------------------------------------ |
| `isOpen`               | `boolean`    | required    | Controls modal visibility                                                                              |
| `onClose`              | `() => void` | required    | Dismiss callback (backdrop click, escape, close button)                                                |
| `title`                | `ReactNode`  | `undefined` | Jika diisi, Modal merender header bar dengan title di kiri dan tombol X di kanan                       |
| `size`                 | `ModalSize`  | `"lg"`      | Max-width variant: `sm` \| `md` \| `lg` \| `xl` \| `2xl` \| `3xl` \| `4xl` \| `5xl` \| `6xl` \| `full` |
| `showCloseButton`      | `boolean`    | `true`      | Renders an `X` close button                                                                            |
| `closeButtonDisabled`  | `boolean`    | `false`     | Disables the close button (for async operations)                                                       |
| `closeOnEscape`        | `boolean`    | `true`      | Dismiss on `Escape` key                                                                                |
| `closeOnBackdropClick` | `boolean`    | `true`      | Dismiss on backdrop click                                                                              |
| `className`            | `string`     | `""`        | Additional class for container                                                                         |
| `children`             | `ReactNode`  | required    | Modal body content                                                                                     |

## Close Button & Title Rendering

- **Dengan `title`**: Modal merender header bar (`px-6 py-4 border-b bg-muted/30`) dengan `title` (biasanya `<Badge>`) di kiri dan tombol X di kanan. Ini adalah pola yang disarankan untuk semua organism-level modals.
- **Tanpa `title`**: Tombol X dirender sebagai `absolute top-4 right-4 z-10` di atas `children`. Container memiliki `relative` sehingga posisi tepat di pojok kanan atas card modal.
- **`closeButtonDisabled`**: Saat `true`, tombol X memiliki `disabled` + `opacity-50` + `cursor-not-allowed`. Gunakan untuk mencegah penutupan modal saat async operation berlangsung.

## Semantic Tokens Used

- Backdrop: `bg-foreground/40`, `backdrop-blur-xs`
- Container: `bg-card`, `border-border`, `shadow-xl`, `rounded-3xl`
- Header bar: `bg-card`, `border-border`, `sticky top-0 z-10` (sticks to top during scroll)
- Close button hover: `hover:bg-accent`, `text-muted-foreground`, `hover:text-foreground`
- Close button disabled: `opacity-50`, `cursor-not-allowed`

## Size Mapping

| Size   | Tailwind Class |
| ------ | -------------- |
| `sm`   | `max-w-sm`     |
| `md`   | `max-w-md`     |
| `lg`   | `max-w-lg`     |
| `xl`   | `max-w-xl`     |
| `2xl`  | `max-w-2xl`    |
| `3xl`  | `max-w-3xl`    |
| `4xl`  | `max-w-4xl`    |
| `5xl`  | `max-w-5xl`    |
| `6xl`  | `max-w-6xl`    |
| `7xl`  | `max-w-7xl`    |
| `full` | `max-w-[95vw]` |

## Code Example

### Dengan prop `title` (header bar otomatis)

```tsx
import Modal from "@/components/molecules/Modal";
import Badge from "@/components/atoms/Badge";

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title={<Badge variant="info">Penugasan Admin</Badge>}
  size="2xl"
>
  <div className="p-6 overflow-y-auto flex-1 scrollbar-none">
    <p>Modal body content goes here.</p>
  </div>
  <div className="px-6 py-4 border-t border-border flex justify-end gap-3 bg-muted/30 shrink-0">
    <Button variant="outline" size="sm" onClick={handleClose}>
      Tutup
    </Button>
  </div>
</Modal>;
```

### Dengan `closeButtonDisabled` (untuk async operations)

```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title={<Badge variant="warning">Konfirmasi Pilihan Suara</Badge>}
  size="lg"
  closeButtonDisabled={isSubmitting}
  closeOnEscape={!isSubmitting}
  closeOnBackdropClick={!isSubmitting}
>
  {/* Body content */}
  {/* Footer with action buttons */}
</Modal>
```
