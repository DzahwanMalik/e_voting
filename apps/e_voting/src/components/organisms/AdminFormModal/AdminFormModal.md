# AdminFormModal

- **Level**: Organism
- **Folder**: `src/components/organisms/AdminFormModal/`

## Purpose

Dialog modal form for creating or editing an Admin user. Wraps the `<Modal>` molecule and uses React Hook Form + Zod for text-field validation. Only accessible by Super Admin (enforced by backend BR-01/BR-03).

Per PRD Section 13: "Admin → dibuat oleh Super Admin".

### Mode Behavior

| Mode | Fields | Password |
| :--- | :--- | :--- |
| `create` | username (required), name (required), password (required, min 6) | Required |
| `edit` | username (required), name (required), password (optional) | Optional — empty means no change |

## Props

| Prop | Type | Description |
| :--- | :--- | :--- |
| `mode` | `"create" \| "edit"` | Form mode controls field requirements and title |
| `admin` | `AdminUserDetail \| null` | Admin data for edit mode; `null` in create mode |
| `isOpen` | `boolean` | Modal visibility |
| `onClose` | `() => void` | Dismiss callback (disabled while submitting) |
| `onSaved` | `() => void` | Called after successful create/update — triggers parent to refetch list |

## Form Fields

| Field | Type | Validation | Create Mode | Edit Mode |
| :--- | :--- | :--- | :--- | :--- |
| Username | text | min 1, trim | Required | Required |
| Nama Lengkap | text | min 1, trim | Required | Required |
| Password | password | min 6 (when provided) | Required | Optional (empty = no change) |

## Dependencies

- Atoms: `Button`, `Input`
- Molecules: `FormField`, `Modal`
- Services: `createAdminApi`, `updateAdminApi` (from `@/services/user.service`)
- Schema: `adminFormSchema` (Zod), `AdminFormData` (inferred type)
- Libraries: `react-hook-form` (`useForm`, `zodResolver`)

## Semantic Tokens Used

- Modal container: `bg-card`, `border-border`, `rounded-3xl`, `shadow-xl`
- Form text: `text-foreground`, `text-muted-foreground`
- Footer: `bg-muted/30`, `border-border`
- Error text: `text-destructive`

## Code Example

```tsx
import AdminFormModal from "@/components/organisms/AdminFormModal";

<AdminFormModal
  mode="create"
  admin={null}
  isOpen={isFormOpen}
  onClose={() => setIsFormOpen(false)}
  onSaved={handleRefetch}
/>

<AdminFormModal
  mode="edit"
  admin={selectedAdmin}
  isOpen={isFormOpen}
  onClose={() => setIsFormOpen(false)}
  onSaved={handleRefetch}
/>
```
