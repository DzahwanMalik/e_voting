# VoterDashboardPage

- **Level**: Page
- **Folder**: `src/components/pages/VoterDashboardPage/`

## Purpose

Route container khusus untuk peran **Voter**. Merender `<VoterDashboard />` di dalam `<VoterDashboardLayout>` (top navbar layout).

> **Catatan**: Admin dan Super Admin menggunakan `AdminShellPage` → `AdminDashboardLayout` → `Sidebar` (dengan navigasi samping ke halaman Pemilihan, Kandidat, Pemilih, Penugasan Admin, dan Hasil Voting). `VoterDashboardPage` hanya untuk voter.

## Props

None. Self-contained page component yang membaca Zustand store untuk `user` dan `displayName`.

## Semantic Tokens Used

- Outer Canvas & Shell: `bg-background`, `bg-card`, `border-border`, `shadow-xs`
- Brand & Actions: `bg-primary`, `text-primary-foreground`
- Status Badges: `bg-success`

## Code Example

```tsx
import { VoterDashboardPage } from "@/components/pages/VoterDashboardPage";

// In router configuration
<Route path="/voter/dashboard" element={<VoterDashboardPage />} />
```
