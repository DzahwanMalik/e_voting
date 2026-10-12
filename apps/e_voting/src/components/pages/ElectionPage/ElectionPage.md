# ElectionPage

- **Level**: Page
- **Folder**: `src/components/pages/ElectionPage/`

## Purpose

Route view component for the **Elections** management page accessible by both **Admin** and **Super Admin**. Replaces the `ComingSoonPage` placeholder at `/admin/elections`.

This page renders within the `AdminShellPage` → `AdminDashboardLayout` → `Sidebar` shell (sidebar stays visible).

Per PRD Section 3 (Election) and BR-05 (Admin Election Scope):
- **Super Admin** can view **all** elections and is permitted to delete them (BR-04 — only Super Admin creates or deletes elections).
- **Admin** can only view **assigned** elections; delete actions are not available.

Elections are fetched via `getElectionsApi()` from `/services/election.service.ts`. The backend enforces role-based scoping (`getAllElections` filters by role):
- `SUPER_ADMIN` → returns all elections with `electionAdmins` and `_count` aggregation.
- `ADMIN` → returns only elections where `electionAdmins` includes the current user's `userId`.

This component is self-contained — it reads user role directly from `useUserStore`, following the same pattern as `VoterDashboardPage`.

Page layout uses `<SectionCard>` (from `molecules/SectionCard`) for both the page header banner and the elections table section, ensuring a consistent card surface (`bg-card`, `border-border`, `shadow-sm`, `rounded-3xl`) across all admin pages.

## Props

None. Self-contained page component that reads all state from `useUserStore`.

## Layout Sections

| Section | Component | Pattern |
| :--- | :--- | :--- |
| Page Header | `<SectionCard padding="default">` (children) | Banner with icon, h1 title, and role-based subtitle |
| Elections Table | `<SectionCard title="Daftar Pemilihan (n)" padding="none">` | Header via `title` prop; body wraps `DataTable` or `LoadingState` |

## Semantic Tokens Used

- Page Canvas: `bg-background`, `text-foreground` (via `AdminDashboardLayout`)
- Card Surface (via `SectionCard`): `bg-card`, `border-border`, `text-card-foreground`, `shadow-sm`, `rounded-3xl`
- Status Badges: `bg-info-subtle`, `bg-secondary`, `text-secondary-foreground`
- Icon Accent: `bg-secondary`, `text-primary`, `rounded-xl`

## Row Actions (per role)

| Action | Super Admin | Admin |
| :--- | :--- | :--- |
| Lihat Detail | ✓ (modal: `ElectionDetailModal`) | ✓ (modal: `ElectionDetailModal`) |
| Penugasan Admin | ✓ (modal) | ✗ (hidden) |
| Hasil Voting | ✓ (modal) | ✗ (hidden) |
| Hapus Pemilihan | ✓ (modal: `ConfirmModal`) | ✗ (hidden) |

> **Penugasan Admin** dan **Hasil Voting** hanya tersedia untuk Super Admin dan ditampilkan melalui **modal** yang di-trigger dari opsi pada *datatable menu* Election page (bukan sebagai menu navigasi terpisah atau route terpisah). Modal ini merender `AdminAssignmentModal` dan `ElectionResultModal` secara inline di dalam halaman Election.

Delete is guarded by `ConfirmModal` (replaces `window.confirm()`) and shows per-row loading (`isDeletingId`).

"Lihat Detail" opens `ElectionDetailModal` (an organism-level modal composing `<Modal>`), showing election summary stats (candidate pair/voter/admin counts), timeline, and optional candidate pair/admin lists.

## Code Example

```tsx
import ElectionPage from "@/components/pages/ElectionPage";

// Inside <Routes> in main.tsx
<Route path="/admin/elections" element={<ElectionPage />} />
```

