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

## Data Display: Card Grid (not a table)

Candidate pairs are rendered as **one card per pair** using `CandidatePairCard` (organism), laid out in a responsive grid (`grid-cols-1` full width if only one pair, `xl:grid-cols-2` when more than one) — the same concept used by `ElectionPage` with `AdminElectionCard`.

Every piece of information that used to live in a table column is displayed directly on the card, and every action that used to live in the row-options dropdown is rendered as an explicit button in the card footer. `DataTable` is no longer used on this page.

`CandidatePairCard` is purely presentational: it receives the pair row plus action callbacks. The page keeps ownership of data fetching, role checks, delete confirmation, and all modals.

## Election Filter (Pill Tabs)

Because the pairs list is **flat** (pairs from every election are mixed together), the page offers a single-select pill filter grouped by election, rendered with `TabList` (molecule) + `Tab` (atom).

- The tab options are **derived from the already loaded pairs** (`useMemo` over `pairs`): `"Semua"` (total count) plus one tab per distinct `electionId`, sorted alphabetically by election title. Each tab shows a count badge.
- Options are built from role-scoped data, so an **Admin only sees elections they manage** — this is UX convenience, not an authorization boundary (the backend still scopes `getAllCandidatePairs`).
- The filter is **client-side** (no extra request, no backend change) and instant.
- The **default selection is the first election tab (index 1)**, not `"Semua"` — so the page initially shows the pairs of the first election (alphabetically). `"Semua"` remains available as index 0 for showing every pair.
- The `TabList` is only rendered when there is more than one election (`electionTabs.length > 2`); with a single election the "Semua" tab would be redundant.
- The selection is stored as `null` until the user picks a tab; during render it resolves to the first election tab. If the selected election no longer exists after a refresh (e.g. deleted), the page falls back to the first election tab (or `"all"` while there are no elections yet) — no `useEffect`/`setState` is used for this, keeping the page free of effect-driven state.
- The section title count (`Daftar Paslon (n)`) reflects the **currently visible** (filtered) pairs.
- Selecting an election with no pairs shows a dedicated `EmptyState` ("Tidak Ada Paslon").

## Layout Sections

| Section | Component | Pattern |
| :--- | :--- | :--- |
| Page Header | `<SectionCard padding="default">` (children) | Banner with icon, h1 title, role-based subtitle |
| Pair List | `<SectionCard title="Daftar Paslon (n)" padding="none">` | Header via `title` prop; toolbar row contains the election `TabList` (when > 1 election) and the "Tambah Paslon" button, followed by `LoadingState`, `EmptyState`, or the card grid |

### Card Content (via `CandidatePairCard`)

| Information | Where it appears on the card |
| :--- | :--- |
| Calon & Wakil | Card header title (`calon & wakil`) |
| Pemilihan | Card header badge (election title) |
| Dibuat | Card header, below the title, with calendar icon |
| Foto Pasangan | Body, `aspect-video` image (or placeholder when absent) |
| Calon Utama / Wakil Calon | Candidate tiles with photo/initials, name, and role label |
| Perolehan Suara | Stat tile — **Super Admin only** (BR-12) |
| Visi | Body panel, clamped to three lines |

> Full vision and mission, candidate birthdays, and descriptions remain available through `CandidatePairDetailModal` ("Lihat Detail").

## Card Actions per Role

| Action | Super Admin | Admin | Modal Used |
| :--- | :--- | :--- | :--- |
| Lihat Detail | ✓ | ✓ | `CandidatePairDetailModal` (reused, inspection-only) |
| Edit Paslon | ✓ | ✓ | `CandidatePairFormModal` |
| Hapus Paslon | ✓ | ✓ | `ConfirmModal` (delete confirmation) |

> The backend enforces scope: Admin can only edit/delete pairs from elections they manage. Delete is destructive per BR-14 (removes entire pair + cascades votes; `hasVoted` status preserved).

Actions are always visible on the card footer — no dropdown menu is required. Per-card loading (`isDeletingId` → `isDeleting` prop on the card) shows a spinner and disables the delete button while deletion is in flight.

## BR-12 Enforcement

Applied both in the backend (`getAllCandidatePairs` strips `_count` for Admin) and the frontend (the page only passes `showVotes={isSuperAdmin}` to the card, which then renders the vote stat tile). This is defense-in-depth.

## Modal Composition

| Modal | Trigger | Purpose |
| :--- | :--- | :--- |
| `CandidatePairDetailModal` | "Lihat Detail" card action | Reused organism — read-only pair profile (calon + wakil photos, names, birthdays, descriptions, shared vision/mission). Inspection-only, no vote action. |
| `CandidatePairFormModal` | "Tambah Paslon" button, "Edit" card action | Create new pair (election dropdown + calon/vice fields + photos + vision/mission) or edit existing pair. Edit mode uses the row's `election` as read-only info and does **not** fetch the election list. |
| `ConfirmModal` | "Hapus" card action | Delete confirmation with per-card loading state (`isDeletingId`) |

## Semantic Tokens Used

- Page Canvas: `bg-background`, `text-foreground` (via `AdminDashboardLayout`)
- Card Surface (via `SectionCard`): `bg-card`, `border-border`, `text-card-foreground`, `shadow-sm`, `rounded-3xl`
- Icon Accent: `bg-secondary`, `text-primary`, `rounded-xl`
- Candidate tiles / stat tile: `bg-muted/30`, `border-border`
- Vision block: `bg-secondary/40`, `border-border`
- Muted text: `text-muted-foreground`
- Destructive action: `destructive-ghost` button variant (`text-destructive`)

## Dependencies

- Atoms: `Badge`, `Button`, `Tab` (rendered inside `TabList`)
- Molecules: `SectionCard`, `EmptyState`, `LoadingState`, `ImagePreview` (rendered inside `CandidatePairCard`), `TabList`, `ConfirmModal`
- Organisms: `CandidatePairCard`, `CandidatePairDetailModal`, `CandidatePairFormModal`
- Services: `getAllCandidatePairsApi`, `deleteCandidatePairApi` (from `@/services/election.service`)
- Stores: `useUserStore` (for role checks)
- Utilities: `formatDate` (used inside `CandidatePairCard`)

## Code Example

```tsx
import CandidatePairPage from "@/components/pages/CandidatePairPage";

// Inside <Routes> in main.tsx
<Route path="/admin/candidate-pairs" element={<CandidatePairPage />} />
```
