# CandidatePairPage

- **Level**: Page
- **Folder**: `src/components/pages/CandidatePairPage/`

## Purpose

Route view component for the **Paslon (Candidate Pair)** management page accessible by both **Admin** and **Super Admin** at `/admin/candidate-pairs`. Replaces the `ComingSoonPage` placeholder.

This page renders within the `AdminShellPage` → `AdminDashboardLayout` → `Sidebar` shell (sidebar stays visible).

Per PRD Section 5 (Candidate Pair) and §15.3 (Candidate Management), with reference to BR-09 (Candidate Ownership), BR-12 (Result Access), BR-13 (Election Isolation), BR-14 (Candidate Deletion), and BR-15 (Candidate Update):

- **Super Admin**: Can view all candidate pairs across all elections, create new pairs, edit any pair, and delete any pair. Vote counts are visible (per BR-12 — only Super Admin may see results).
- **Admin**: Can view, create, edit, and delete candidate pairs **only within elections they manage**. The backend enforces scope via `getAllCandidatePairs` (filters by `electionAdmins`). Vote counts are **hidden** per BR-12.

Candidate pairs are fetched via `getAllCandidatePairsApi()` from `@/services/election.service.ts` (top-level `GET /candidate-pairs` route). The backend enforces role-based scoping:

- `SUPER_ADMIN` → returns all pairs with election info + vote counts (`_count`).
- `ADMIN` → returns only pairs from elections where `electionAdmins` includes the current user's `userId`.

## Props

None. Self-contained page component that reads all state from `useUserStore`.

## Layout Sections

| Section     | Component                                                | Pattern                                                                 |
| :---------- | :------------------------------------------------------- | :---------------------------------------------------------------------- |
| Page Header | `<SectionCard padding="default">`                        | Banner with icon, h1 title, role-based subtitle, "Tambah Paslon" button |
| Pairs Table | `<SectionCard title="Daftar Paslon (n)" padding="none">` | Header via `title` prop; body wraps `DataTable` or `LoadingState`       |

## Data Columns

| Column           | Header    | Content                           | Super Admin Only? |
| :--------------- | :-------- | :-------------------------------- | :---------------- |
| `election.title` | Pemilihan | Badge with election title         | No                |
| `candidate.name` | Calon     | Main candidate name + description | No                |
| `vice.name`      | Wakil     | Vice candidate name + description | No                |
| `_count.votes`   | Suara     | Vote count badge                  | **Yes** (BR-12)   |
| `createdAt`      | Dibuat    | Formatted creation date           | No                |

> **BR-12 enforcement** is applied both in the backend (`getAllCandidatePairs` strips `_count` for Admin) and the frontend (the "Suara" column is only pushed into the `columns` array when `isSuperAdmin()` is true). This is defense-in-depth.

## Row Actions (both roles)

| Action       | Super Admin | Admin | Modal Used                                           |
| :----------- | :---------- | :---- | :--------------------------------------------------- |
| Lihat Detail | ✓           | ✓     | `CandidatePairDetailModal` (reused, inspection-only) |
| Edit Paslon  | ✓           | ✓     | `CandidatePairFormModal`                             |
| Hapus Paslon | ✓           | ✓     | `ConfirmModal` (delete confirmation)                 |

> The backend enforces scope: Admin can only edit/delete pairs from elections they manage. Delete is destructive per BR-14 (removes entire pair + cascades votes; `hasVoted` status preserved).

## Modal Composition

| Modal                      | Trigger                                          | Purpose                                                                                                                                                  |
| :------------------------- | :----------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CandidatePairDetailModal` | "Lihat Detail" row option                        | Reused organism — read-only pair profile (calon + wakil photos, names, birthdays, descriptions, shared vision/mission). Inspection-only, no vote action. |
| `CandidatePairFormModal`   | "Tambah Paslon" button, "Edit Paslon" row option | Create new pair (election dropdown + calon/vice fields + photos + vision/mission) or edit existing pair                                                  |
| `ConfirmModal`             | "Hapus Paslon" row option                        | Delete confirmation with per-row loading state (`isDeletingId`)                                                                                          |

## Semantic Tokens Used

- Page Canvas: `bg-background`, `text-foreground` (via `AdminDashboardLayout`)
- Card Surface (via `SectionCard`): `bg-card`, `border-border`, `text-card-foreground`, `shadow-sm`, `rounded-3xl`
- Icon Accent: `bg-primary`, `text-primary-foreground`, `rounded-xl`
- Status Badges: `bg-info-subtle` / `text-info-subtle-foreground` (Suara column, SA only)

## Code Example

```tsx
import CandidatePairPage from "@/components/pages/CandidatePairPage";

// Inside <Routes> in main.tsx
<Route path="/admin/candidate-pairs" element={<CandidatePairPage />} />;
```
