# VoterPage

- **Level**: Page
- **Folder**: `src/components/pages/VoterPage/`

## Purpose

Route view component for the **Voters** management page accessible by both **Admin** and **Super Admin** at `/admin/voters`. Replaces the `ComingSoonPage` placeholder.

This page renders within the `AdminShellPage` → `AdminDashboardLayout` → `Sidebar` shell (sidebar stays visible).

Per PRD Section 15.4 (Voter Management), BR-07 (Voter Eligibility), BR-08 (Admin Voter Scope), and BR-16 (Voter Removal):

- **Super Admin**: Can view all voters, create voters, edit any voter, and delete any voter.
- **Admin**: Can view voters within scope (voters they created + voters in elections they manage), create voters, and edit/delete only voters they created. The backend enforces creator-scope (BR-08); the frontend disables edit/delete row options for voters outside the Admin's scope for improved UX.

Voters are fetched via `getVotersApi()` from `@/services/voter.service.ts` with search and pagination support (backend enforces role-based scoping in `getAllVoters`).

## Props

None. Self-contained page component that reads all state from `useUserStore`.

## Layout Sections

| Section | Component | Pattern |
| :--- | :--- | :--- |
| Page Header | `<SectionCard padding="default">` (children) | Banner with icon, h1 title, role-based subtitle, "Tambah Voter" button |
| Voters Table | `<SectionCard title="Daftar Pemilih (n)" padding="none">` | Header via `title` prop; body wraps `DataTable` or `LoadingState` |

## Data Columns

| Column | Header | Content |
| :--- | :--- | :--- |
| `name` | Nama | Voter display name with avatar initials |
| `username` | Username | `@username` |
| `elections` | Election | Badge with count of enrolled elections |
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

## Semantic Tokens Used

- Page Canvas: `bg-background`, `text-foreground` (via `AdminDashboardLayout`)
- Card Surface (via `SectionCard`): `bg-card`, `border-border`, `text-card-foreground`, `shadow-sm`, `rounded-3xl`
- Avatar: `bg-primary/10`, `text-primary`, `border-border`
- Status Badges: `bg-muted` (default), `bg-info-subtle` / `bg-success-subtle` (in detail modal)
- Icon Accent: `bg-primary`, `text-primary-foreground`, `rounded-xl`

## Code Example

```tsx
import VoterPage from "@/components/pages/VoterPage";

// Inside <Routes> in main.tsx
<Route path="/admin/voters" element={<VoterPage />} />
```
