# SettingsPage

- **Level**: Page
- **Folder**: `src/components/pages/SettingsPage/`

## Purpose

Route view for `/admin/settings`, accessible **only to Super Admin**. Hosts administrative operations that are not part of the day-to-day election workflow. The first capability is **Reset Data Voting** (PRD BR-18), which deletes every vote across all elections and resets every `ElectionVoter.hasVoted` flag to `false` while leaving master data untouched.

The page renders inside `AdminShellPage` → `AdminDashboardLayout` → `Sidebar`. Route access is guarded by a nested `ProtectedRoute` with `allowedRoles={["SUPER_ADMIN"]}`, and the API itself enforces `requireRole(SUPER_ADMIN)` on the backend.

## Props

None. Self-contained page component.

## Layout Sections

| Section | Component | Pattern |
| :--- | :--- | :--- |
| Page Header | `<SectionCard>` | Settings icon, `h1`, and Super Admin subtitle |
| Danger Zone | `<SectionCard title=... subtitle=...>` | Destructive warning panel + reset trigger |
| Confirmation | `<ResetVotingModal>` | Typed `RESET` confirmation, loading state |

## Behavior

1. Super Admin clicks **Reset Semua Data Voting**.
2. `ResetVotingModal` opens and lists the impact of the operation.
3. The confirm button stays disabled until the user types `RESET`.
4. `handleResetVoting` calls `resetAllVotesApi()` from `@/services/vote.service`.
5. On success, a Sonner toast reports deleted votes and reset voter count, then the modal closes.
6. On failure, the backend message is shown via `toast.error`.

## Semantic Tokens Used

- Card surface: `bg-card`, `border-border`, `text-card-foreground`
- Icon accent: `bg-secondary`, `text-primary`
- Danger surface: `border-destructive/30`, `bg-destructive/5`, `text-destructive`
- Text: `text-foreground`, `text-muted-foreground`

## Dependencies

- Atoms: `Button`
- Molecules: `SectionCard`
- Organisms: `ResetVotingModal`
- Services: `resetAllVotesApi` (from `@/services/vote.service`)
- Libraries: `sonner`

## Code Example

```tsx
import SettingsPage from "@/components/pages/SettingsPage";

// Inside <Routes> in main.tsx
<Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />}>
  <Route path="/admin/settings" element={<SettingsPage />} />
</Route>;
```
