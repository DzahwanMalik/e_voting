# AdminPage

- **Level**: Page
- **Folder**: `src/components/pages/AdminPage/`

## Purpose

Super Admin-only page for managing Admin users via full CRUD operations. Displays a DataTable of all admins with row-level actions (view detail, edit, delete). Uses `AdminFormModal` for create/edit and `AdminDetailModal` for detail view.

Per PRD Section 2.1 ("mengelola user") and Section 13 ("Admin → dibuat oleh Super Admin"). Authorization is enforced in the frontend via `ProtectedRoute` (SUPER_ADMIN, ADMIN) and the backend via `requireRole(SUPER_ADMIN)` on all endpoints.

## State

| State | Type | Purpose |
| :--- | :--- | :--- |
| `admins` | `AdminUser[]` | List of admins for the table |
| `isLoading` | `boolean` | Initial load + refresh state |
| `searchQuery` | `string` | Search filter for username/name |
| `refreshKey` | `number` | Trigger refetch after mutations |
| `isDeletingId` | `number \| null` | Tracks which admin is being deleted |
| `deleteConfirmAdmin` | `AdminUser \| null` | Admin pending delete confirmation |
| `detailAdmin` | `AdminUserDetail \| null` | Admin for detail modal |
| `detailAdminId` | `number \| null` | Queued admin ID for detail fetch |
| `isFormOpen` | `boolean` | Admin form modal visibility |
| `formMode` | `"create" \| "edit"` | Form mode |
| `editAdmin` | `AdminUserDetail \| null` | Admin data for edit form |

## Behavior

1. On mount / `refreshKey` change → `getAllAdminsApi()` fetches all admins.
2. **Create**: "Tambah Admin" button opens `AdminFormModal` in create mode → `POST /users/admins`.
3. **View Detail**: "Lihat Detail" row option opens `AdminDetailModal` → `GET /users/admins/:id`.
4. **Edit**: "Edit Admin" row option fetches detail via `GET /users/admins/:id`, then opens `AdminFormModal` in edit mode → `PUT /users/admins/:id`.
5. **Delete**: "Hapus Admin" row option opens `ConfirmModal` → `DELETE /users/admins/:id`.
6. After any mutation → `onSaved` triggers `refreshKey` increment → refetch list.

## Dependencies

- Atoms: `Badge`, `Button`, `Input`
- Molecules: `SectionCard`, `LoadingState`, `ConfirmModal`
- Organisms: `DataTable`, `AdminFormModal`, `AdminDetailModal`
- Services: `getAllAdminsApi`, `getAdminByIdApi`, `deleteAdminApi` (from `@/services/user.service`)
- Utilities: `formatDate` (from `@/lib/utils`)
- Stores: `useUserStore` (for role checks, if needed)

## Semantic Tokens Used

- Page header: `bg-primary`, `text-primary-foreground`
- Cards: `bg-card`, `border-border`, `text-card-foreground`
- Table text: `text-foreground`, `text-muted-foreground`
- Badge: `bg-secondary`, `text-secondary-foreground`
- Search input: `bg-background`, `border-border`, `text-foreground`, `placeholder-muted-foreground`, `focus:ring-ring`

## Code Example

```tsx
// In main.tsx routing
<Route path="/admin/admins" element={<AdminPage />} />
```
