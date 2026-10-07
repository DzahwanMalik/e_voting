# VoterDashboardLayout

- **Level**: Layout
- **Folder**: `src/components/layouts/VoterDashboardLayout/`

## Purpose

Layout shell khusus untuk **Voter** — menyediakan top sticky navbar dengan branding E-Voting, role badge indikator, nama pengguna aktif, dan tombol logout. Membungkus area konten utama (`main`) dalam container responsif `max-w-7xl mx-auto`.

> **Perbedaan dengan `AdminDashboardLayout`:** Layout ini hanya untuk Voter (top navbar). Admin/Super Admin menggunakan `AdminDashboardLayout` yang dilengkapi Sidebar navigasi vertikal.

## Props

- `children`: Elemen konten utama dashboard (misal `<VoterDashboard />`).
- `roleName`: `"Voter"` — label peran untuk ditampilkan pada badge header.
- `displayName`: Nama atau username pengguna yang sedang login.
- `onLogout`: Callback ketika tombol keluar ditekan.
- `isLoggingOut`: Status loading proses logout.

## Semantic Tokens Used

- Canvas: `bg-background`, `text-foreground`, `font-sans`
- Surface: `bg-card`, `border-border`, `shadow-xs`
- Brand: `bg-primary`, `text-primary-foreground`
- Status Badge (Voter): `bg-success-subtle`, `text-success-subtle-foreground`

## Code Example

```tsx
import { VoterDashboardLayout } from "@/components/layouts/VoterDashboardLayout";

<VoterDashboardLayout
  roleName="Voter"
  displayName="Budi"
  onLogout={handleLogout}
  isLoggingOut={false}
>
  <VoterDashboard displayName="Budi" />
</VoterDashboardLayout>
```
