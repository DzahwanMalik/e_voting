# Sidebar Component

- **Level**: Organism
- **Folder**: `src/components/organisms/Sidebar/`

## Purpose

Vertical navigation rail for the Admin and Super Admin shell layouts. The sidebar renders every navigation item for both roles and is **not** an authorization boundary; route access is enforced by nested `ProtectedRoute` in `src/main.tsx`.

| Nav Item | Route Access | Rationale |
|---|---|---|
| Pemilihan (Elections) | Admin, Super Admin | BR-05: Admin manages assigned; BR-03/04: Super Admin manages all |
| Paslon (Candidates) | Admin, Super Admin | Manage candidate pairs within election scope |
| Pemilih (Voters) | Admin, Super Admin | Create & enroll voters within scope |
| Admin | Super Admin only | BR-02/BR-03/BR-06: Super Admin manages admin accounts and assignments |
| Pengaturan (Settings) | Super Admin only | BR-18: Super Admin-only destructive operations, including reset data voting |

> **Catatan Navigasi:** Admin yang membuka `/admin/admins` atau `/admin/settings` secara langsung akan diarahkan ulang ke `/admin/elections` oleh route guard.
>
> **Catatan Navigasi:** _Penugasan Admin_ dan _Hasil Voting_ tidak tersedia sebagai menu navigasi terpisah. Kedua fitur ini hanya dapat diakses oleh Super Admin melalui card pada Election page (lihat `ElectionPage`): _Penugasan Admin_ via tombol pada card, sedangkan _Hasil Voting_ langsung ditampilkan sebagai chart di dalam card.

## Props

- `roleName`: `"Super Admin" | "Admin"` — displayed in the sidebar footer; does not control navigation visibility.
- `displayName`: Active user's name or username — displayed in the footer.
- `onLogout`: Callback when the logout button is clicked.
- `isLoggingOut`: Optional loading state for the logout action.

## Semantic Tokens Used

- `bg-card`, `border-border`, `text-foreground` — sidebar surface
- `bg-primary`, `text-primary-foreground` — active nav item
- `bg-accent`, `text-accent-foreground` — hover nav item
- `bg-muted` — user avatar placeholder
- `bg-destructive` — (future) destructive actions

## Responsive Behavior

- **Desktop (>= `md` breakpoint)**: Sidebar is a fixed, full-height vertical rail on the left (`w-64`).
- **Mobile (`< md`)**: Sidebar displays a sticky top header with brand icon, title, and hamburger button. Tapping the button opens a full-height slide-out drawer (`w-64`) with backdrop blur, internal close (`X`) button, scrollable navigation, and pinned logout footer. Drawer automatically closes upon navigating or tapping outside.

## Code Example

```tsx
import Sidebar from "@/components/organisms/Sidebar";

<Sidebar
  roleName="Super Admin"
  displayName="Budi Santoso"
  onLogout={handleLogout}
  isLoggingOut={false}
/>
```

