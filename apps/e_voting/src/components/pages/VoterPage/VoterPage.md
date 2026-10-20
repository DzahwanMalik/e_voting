# VoterPage

- **Level**: Page
- **Folder**: `src/components/pages/VoterPage/`

## Purpose

Route view component for the **Voters** management page accessible by both **Admin** and **Super Admin** at `/admin/voters`. Replaces the `ComingSoonPage` placeholder.

This page renders within the `AdminShellPage` → `AdminDashboardLayout` → `Sidebar` shell (sidebar stays visible).

Per PRD Section 15.4 (Voter Management), BR-07 (Voter Eligibility), BR-08 (Admin Voter Scope), BR-16 (Voter Removal), and BR-19 (Bulk Voter Deletion):

- **Super Admin**: Can view all voters, create voters, edit any voter, delete any voter, and bulk delete **all** voters via the "Hapus Semua Voter" header action (BR-19). The bulk action opens `DeleteAllVotersModal` and requires typed confirmation.
- **Admin**: Can view voters within scope (voters they created + voters in elections they manage), create voters, and edit/delete only voters they created. The backend enforces creator-scope (BR-08); the frontend disables edit/delete row options for voters outside the Admin's scope for improved UX. The bulk delete action is **not rendered** for Admin; the backend endpoint is also restricted to `SUPER_ADMIN`.

Voters are fetched via `getVotersApi()` from `@/services/voter.service.ts` with search and pagination support (backend enforces role-based scoping in `getAllVoters`).

## Props

None. Self-contained page component that reads all state from `useUserStore`.

## Layout Sections

| Section | Component | Pattern |
| :--- | :--- | :--- |
| Page Header | `<SectionCard padding="default">` (children) | Banner with icon, h1 title, role-based subtitle |
| Table Toolbar | Custom flex row | "Hapus Semua Voter" (destructive, Super Admin only) + "Tambah Voter" (primary) |
| Voters Table | `<SectionCard title="Daftar Pemilih (n)" padding="none">` | Header via `title` prop; body wraps `DataTable` or `LoadingState` |

## Data Columns

| Column | Header | Content |
| :--- | :--- | :--- |
| `name` | Nama | Voter display name with avatar initials |
| `username` | Username | `@username` |
| `elections` | Election | Badge with count of enrolled elections |
| `votingStatus` | Status Voting | Derived from `electionVoters[].hasVoted`: `Sudah Vote` (success), `Belum Vote` (pending), `Sebagian` (info) when enrolled in multiple elections with mixed status, or `Belum Terdaftar` (default) when not enrolled. Subtext shows the voted/enrolled election ratio. |
| `creator` | Pembuat | Name of the admin who created the voter |
| `createdAt` | Dibuat | Formatted creation date |

## Row Actions (per role)

| Action | Super Admin | Admin |
| :--- | :--- | :--- |
| Lihat Detail | ✓ (modal: `VoterDetailModal`) | ✓ (modal: `VoterDetailModal`) |
| Edit Voter | ✓ | ✓ (only for voters they created — `disabled` when `createdById !== userId`) |
| Hapus Voter | ✓ (modal: `ConfirmModal`) | ✓ (only for voters they created — `disabled` when `createdById !== userId`) |

## Modal Composition

| Modal | Trigger | Purpose |
| :--- | :--- | :--- |
| `VoterDetailModal` | "Lihat Detail" row option | Read-only voter details, election enrollments, voting status |
| `VoterFormModal` | "Tambah Voter" button, "Edit Voter" row option | Create new voter (with optional election enrollment) or edit existing voter's name/username/password |
| `ConfirmModal` | "Hapus Voter" row option | Delete confirmation with per-row loading state |
| `DeleteAllVotersModal` | "Hapus Semua Voter" header action (Super Admin only) | Typed-confirmation (`HAPUS SEMUA`) for bulk deletion of all voters (BR-19) |

## Semantic Tokens Used

- Page Canvas: `bg-background`, `text-foreground` (via `AdminDashboardLayout`)
- Card Surface (via `SectionCard`): `bg-card`, `border-border`, `text-card-foreground`, `shadow-sm`, `rounded-3xl`
- Avatar: `bg-primary/10`, `text-primary`, `border-border`
- Status Badges: `bg-muted` (default), `bg-success-subtle` (`Sudah Vote`), `bg-pending-subtle` (`Belum Vote`), `bg-info-subtle` (`Sebagian`)
- Icon Accent: `bg-primary`, `text-primary-foreground`, `rounded-xl`

## Code Example

```tsx
import VoterPage from "@/components/pages/VoterPage";

// Inside <Routes> in main.tsx
<Route path="/admin/voters" element={<VoterPage />} />
```
