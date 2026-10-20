# VoterDashboardPage

- **Level**: Page
- **Folder**: `src/components/pages/VoterDashboardPage/`

## Purpose

Route container khusus untuk peran **Voter**. Merender `<VoterDashboard />` di dalam `<VoterDashboardLayout>` (top navbar layout).

> **Catatan**: Admin dan Super Admin menggunakan `AdminShellPage` → `AdminDashboardLayout` → `Sidebar` (dengan navigasi samping ke halaman Pemilihan, Paslon, dan Pemilih). *Penugasan Admin* dan *Hasil Voting* tidak tersedia sebagai menu navigasi; keduanya diakses Super Admin melalui opsi pada *datatable menu* Election page. `VoterDashboardPage` hanya untuk voter.

## Props

None. Self-contained page component yang membaca Zustand store untuk `user` dan `displayName`.

## Candidate Photos

Halaman ini tidak merender `<img>` secara langsung. Foto kandidat muncul melalui:

- `VoterDashboard` → `VoterElectionCard` → `CandidateRadioCard`: foto kampanye pasangan (`CandidatePair.photoUrl`) dengan fallback inisial. Klik foto membuka full-size preview lewat molecule `ImagePreview`.
- `CandidatePairDetailModal`: foto calon (`candidate.photoUrl`), wakil (`vice.photoUrl`), dan foto pasangan (`pair.photoUrl`), semuanya bisa diklik untuk full-size preview.

Karena itu, penyesuaian preview foto voter terpusat di `CandidateRadioCard`, `CandidatePairDetailModal`, dan `ImagePreview`.

## Semantic Tokens Used

- Outer Canvas & Shell: `bg-background`, `bg-card`, `border-border`, `shadow-xs`
- Brand & Actions: `bg-primary`, `text-primary-foreground`
- Status Badges: `bg-success`

## Code Example

```tsx
import VoterDashboardPage from "@/components/pages/VoterDashboardPage";

// In router configuration
<Route path="/voter/dashboard" element={<VoterDashboardPage />} />
```

