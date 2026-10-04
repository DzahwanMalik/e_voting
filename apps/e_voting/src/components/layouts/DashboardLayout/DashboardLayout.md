# DashboardLayout

Komponen layout utama untuk seluruh halaman dashboard aplikasi E-Voting (Super Admin, Admin, dan Voter).

## Peran & Tanggung Jawab
- Menyediakan kerangka dasar aplikasi dashboard (`min-h-screen`, `bg-background`).
- Menyediakan top navbar sticky dengan branding E-Voting, role badge indikator, nama pengguna aktif, dan tombol logout.
- Membungkus area konten utama (`main`) dalam container responsif `max-w-7xl mx-auto`.

## Props
- `children`: Elemen konten utama dashboard (misal `VoterDashboard`, `AdminDashboard`, atau `SuperAdminDashboard`).
- `roleName`: Label peran ("Super Admin" | "Admin" | "Voter") untuk ditampilkan pada badge header.
- `displayName`: Nama atau username pengguna yang sedang login.
- `onLogout`: Callback ketika tombol keluar ditekan.
- `isLoggingOut`: Status loading proses logout.
