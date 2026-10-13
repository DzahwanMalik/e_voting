# ElectionFormModal Component

- **Level**: Organism
- **Folder**: `src/components/organisms/ElectionFormModal/`

## Purpose

Dialog modal form for creating or editing an **election**. Wraps the `<Modal>` molecule and uses **React Hook Form + Zod** for form validation. Follows the same patterns as `AdminFormModal` and `CandidatePairFormModal`.

Per PRD Section 3 (Election), §15.2 (Election Lifecycle), and BR-04 (Election Creation):

- **Create mode** (Super Admin only): Creates a new election with `title` and optional `description`. Only Super Admin can create elections (enforced by backend route `POST /elections` with `requireRole(SUPER_ADMIN)`).
- **Edit mode** (Super Admin + Admin): Updates an existing election's `title` and `description`. Admin can only update elections assigned to them (enforced by backend service-level scope check).

### RBAC Enforcement

| Action | Frontend Visibility | Backend Enforcement |
| :--- | :--- | :--- |
| Create | "Tambah Pemilihan" button visible to Super Admin only | `POST /elections` — `requireRole(SUPER_ADMIN)` |
| Edit | "Edit Pemilihan" row option visible to Super Admin + Admin | `PUT /elections/:id` — `requireRole(SUPER_ADMIN, ADMIN)` + assignment check |

### String Trimming

Per frontend guideline Aturan 7, all string inputs are trimmed before submission (`data.title.trim()`, `data.description.trim()`).

## Props

| Prop | Type | Description |
| :--- | :--- | :--- |
| `mode` | `"create" \| "edit"` | Form mode controls validation and API call |
| `election` | `ElectionListItem \| null` | Election data for edit mode; `null` in create mode |
| `isOpen` | `boolean` | Modal visibility |
| `onClose` | `() => void` | Dismiss callback (disabled while submitting) |
| `onSaved` | `() => void` | Called after successful create/update — triggers parent to refetch list |

## Form Fields

| Field | Element | Validation | Required? |
| :--- | :--- | :--- | :--- |
| `title` | `<Input>` | `.min(1)`, trimmed | Yes |
| `description` | `<textarea>` | trimmed, no whitespace-only | No |

## Dependencies

- Atoms: `Button`, `Input`
- Molecules: `FormField`, `Modal`
- Services: `createElectionApi`, `updateElectionApi` (from `@/services/election.service`)
- Schema: `electionFormSchema` (Zod), `ElectionFormData` (inferred type)
- Libraries: `react-hook-form` (`useForm`, `zodResolver`)

## Semantic Tokens Used

- Modal container: `bg-card`, `border-border`, `text-card-foreground`, `rounded-3xl`, `shadow-xl`
- Form fields: `bg-card`, `text-foreground`, `border-input`, `border-destructive`, `placeholder:text-muted-foreground`, `focus:ring-primary`
- Section headings: `text-muted-foreground`
- Footer: `bg-muted/30`, `border-border`
- Error text: `text-destructive`

## Code Example

```tsx
import ElectionFormModal from "@/components/organisms/ElectionFormModal";

<ElectionFormModal
  mode="create"
  election={null}
  isOpen={isFormOpen}
  onClose={() => setIsFormOpen(false)}
  onSaved={() => setRefreshKey((k) => k + 1)}
/>

<ElectionFormModal
  mode="edit"
  election={selectedElection}
  isOpen={isFormOpen}
  onClose={() => setIsFormOpen(false)}
  onSaved={() => setRefreshKey((k) => k + 1)}
/>
```
