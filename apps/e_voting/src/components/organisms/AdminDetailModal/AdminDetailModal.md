# AdminDetailModal

- **Level**: Organism
- **Folder**: `src/components/organisms/AdminDetailModal/`

## Purpose

Dialog modal for viewing Admin user details. Shows username, name, role badge, and timeline (created/updated dates). Wraps the `<Modal>` molecule. Read-only — no editable fields (use `AdminFormModal` in edit mode for changes).

## Props

| Prop | Type | Description |
| :--- | :--- | :--- |
| `admin` | `AdminUser \| null` | Admin row to display; renders nothing when `null` |
| `isOpen` | `boolean` | Modal visibility |
| `onClose` | `() => void` | Dismiss callback |

## Content Sections

1. **Header**: Display name + `@username` + role badge
2. **Informasi Akun**: Role information with `Shield` icon
3. **Timeline**: Created date + Updated date using `formatDate` utility

## Dependencies

- Atoms: `Badge`, `Button`
- Molecules: `Modal`
- Icons: `Calendar`, `Clock`, `Shield` (from `lucide-react`)
- Utilities: `formatDate` (from `@/lib/utils`)
- Services: `AdminUser` type (from `@/services/user.service`)

## Semantic Tokens Used

- Modal container: `bg-card`, `border-border`, `rounded-3xl`, `shadow-xl`
- Text: `text-foreground`, `text-muted-foreground`, `text-primary`
- Badge: `bg-secondary`, `text-secondary-foreground`
- Border sections: `border-border`, `hover:bg-accent`
- Footer: `bg-muted/30`, `border-border`

## Code Example

```tsx
import AdminDetailModal from "@/components/organisms/AdminDetailModal";

<AdminDetailModal
  admin={selectedAdmin}
  isOpen={detailVoter !== null}
  onClose={() => setDetailVoter(null)}
/>
```
