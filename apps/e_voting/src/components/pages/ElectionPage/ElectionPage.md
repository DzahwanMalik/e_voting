# ElectionPage

- **Level**: Page
- **Folder**: `src/components/pages/ElectionPage/`

## Purpose

Route view component for the **Elections** management page accessible by both **Admin** and **Super Admin**. Replaces the `ComingSoonPage` placeholder at `/admin/elections`.

This page renders within the `AdminShellPage` → `AdminDashboardLayout` → `Sidebar` shell (sidebar stays visible).

Per PRD Section 3 (Election), §15.2 (Election Lifecycle), and BR-04 (Election Creation):
- **Super Admin** can view **all** elections, is permitted to **create** elections (only Super Admin creates elections per BR-04), and is permitted to delete them.
- **Admin** can only view **assigned** elections; can **edit** their assigned elections (update title/description). Create and delete actions are not available.
- **Create**: Super Admin only (backend route `POST /elections` with `requireRole(SUPER_ADMIN)`).
- **Update**: Super Admin + Admin (backend route `PUT /elections/:id` with `requireRole(SUPER_ADMIN, ADMIN)`; Admin scope enforced at service level).

Elections are fetched via `getElectionsApi()`, and mutations use `createElectionApi()` / `updateElectionApi()` from `/services/election.service.ts`. The backend enforces role-based scoping (`getAllElections` filters by role):
- `SUPER_ADMIN` → returns all elections with `electionAdmins` and `_count` aggregation.
- `ADMIN` → returns only elections where `electionAdmins` includes the current user's `userId`.

Both role responses also include `votedCount` and `unvotedCount` per election (computed via a grouped `electionVoters` query where `hasVoted = true`). These fields power the participation block inside each election card.

This component is self-contained — it reads user role directly from `useUserStore`, following the same pattern as `VoterDashboardPage`.

## Data Display: Card Grid (not a table)

Elections are rendered as **one card per election** using `AdminElectionCard` (organism), laid out in a responsive grid (`grid-cols-1` full width jika hanya 1 pemilihan, atau `xl:grid-cols-2` jika terdapat lebih dari 1 pemilihan). Every piece of information that used to live in a table column is displayed directly on the card, and every management action that used to live in the row-options dropdown is rendered as an explicit button in the card footer.

`AdminElectionCard` is purely presentational apart from the Super Admin result fetch: it receives the election row plus optional action callbacks. The page keeps ownership of data fetching, role checks, delete confirmation, and all modals.

## Hasil Voting (Inline Chart)

Election results are **not** shown in a modal anymore. For **Super Admin** only (PRD BR-12), each card fetches its own result via `getElectionResultApi` and renders an inline `VoteResultChart` from `molecules/VoteResultChart`. The chart displays per-pair vote counts, percentages, and a column chart with the leading pair highlighted. Admin cards never fetch or render results.

Because the chart is fetched per card, the page passes `refreshKey` to each card so results are re-fetched after list refreshes (e.g., voter import).

## Props

None. Self-contained page component that reads all state from `useUserStore`.

## Layout Sections

| Section | Component | Pattern |
| :--- | :--- | :--- |
| Page Header | `<SectionCard padding="default">` (children) | Banner with icon, h1 title, and role-based subtitle |
| Elections List | `<SectionCard title="Daftar Pemilihan (n)" padding="none">` | Header via `title` prop; body contains "Tambah Pemilihan" (Super Admin only) followed by `LoadingState`, `EmptyState`, or the card grid |

### Card Content (via `AdminElectionCard`)

| Information | Where it appears on the card |
| :--- | :--- |
| Judul | Card header title |
| Dibuat | Card header, below the title, with calendar icon |
| Deskripsi | Body, clamped to two lines |
| Paslon | Stat tile (candidate pair count) |
| Pemilih | Stat tile (assigned voter count) |
| Admin | Stat tile (assigned admin count) |
| Partisipasi | Progress block: voted/unvoted counts, percentage, `bg-success` bar |
| Hasil Voting | Inline `VoteResultChart` (Super Admin only) |

### Card Actions per Role

| Action | Super Admin | Admin |
| :--- | :--- | :--- |
| Lihat Detail (modal: `ElectionDetailModal`) | ✓ | ✓ |
| Edit (modal: `ElectionFormModal` edit mode) | ✓ | ✓ |
| Import Voter (modal: `ImportVotersModal`) | ✓ | ✓ |
| Penugasan Admin (modal) | ✓ | ✗ (not rendered) |
| Hapus (modal: `ConfirmModal`) | ✓ | ✗ (not rendered) |

Actions are always visible on the card footer — no dropdown menu is required. Optional callbacks (`onImportVoters`, `onManageAdmins`, `onDelete`) control which buttons render; the page passes `onImportVoters` for both roles, while `onManageAdmins`/`onDelete` are Super Admin only. Hasil Voting is always displayed as an inline chart on Super Admin cards and has no button.

> **Tambah Pemilihan** button (create) hanya tersedia untuk Super Admin, ditempatkan di atas card grid. Ditampilkan melalui `ElectionFormModal` (create mode).

> **Edit Pemilihan** tersedia untuk Super Admin dan Admin. Form pre-filled via `ElectionFormModal` (edit mode) dengan title dan description dari election yang dipilih.

> **Import Voter** dipindahkan dari `ElectionDetailModal` ke footer card election. Tombol ini membuka `ImportVotersModal` (dikelola oleh page) dan tersedia untuk Admin maupun Super Admin. Setelah impor berhasil, page melakukan refresh list sehingga jumlah pemilih dan chart hasil ikut ter-update.

> **Penugasan Admin** hanya tersedia untuk Super Admin dan ditampilkan melalui modal yang di-trigger langsung dari button pada card Election (bukan sebagai menu navigasi terpisah atau route terpisah).

> **Hasil Voting** tidak lagi berupa modal. Untuk Super Admin, hasil perolehan suara langsung ditampilkan di dalam card sebagai chart (`VoteResultChart`); Admin tidak melihat hasil sesuai BR-12.

Delete is guarded by `ConfirmModal` (replaces `window.confirm()`) and shows per-card loading (`isDeletingId` → `isDeleting` prop on the card, which shows a spinner and disables the delete button).

## Semantic Tokens Used

- Page Canvas: `bg-background`, `text-foreground` (via `AdminDashboardLayout`)
- Card Surface (via `SectionCard`): `bg-card`, `border-border`, `text-card-foreground`, `shadow-sm`, `rounded-3xl`
- Icon Accent: `bg-secondary`, `text-primary`, `rounded-xl`
- Stat tiles / participation block: `bg-muted/30`, `border-border`
- Progress bar: track `bg-border`, fill `bg-success`
- Muted text: `text-muted-foreground`

## Dependencies

- Atoms: `Button`
- Molecules: `SectionCard`, `EmptyState`, `LoadingState`, `ConfirmModal`, `VoteResultChart` (rendered inside `AdminElectionCard`)
- Organisms: `AdminElectionCard`, `AdminAssignmentModal`, `ImportVotersModal`, `ElectionDetailModal`, `ElectionFormModal`
- Services: `getElectionsApi`, `deleteElectionApi`, `createElectionApi`, `updateElectionApi`, `getElectionResultApi` (from `@/services/election.service`)
- Stores: `useUserStore` (for role checks)
- Utilities: `formatDate` (used inside `AdminElectionCard`)

## Code Example

```tsx
import ElectionPage from "@/components/pages/ElectionPage";

// Inside <Routes> in main.tsx
<Route path="/admin/elections" element={<ElectionPage />} />
```
