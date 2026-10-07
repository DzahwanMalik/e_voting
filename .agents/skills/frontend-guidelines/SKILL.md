---
name: frontend-guidelines
description: Standar konvensi kode, struktur folder, arsitektur komponen Atomic Design, dan aturan implementasi untuk frontend React + TypeScript (apps/e_voting). Wajib menggunakan arrow function, bottom export (export default pada file .tsx komponen), ref sebagai prop (React 19), token semantik, dan arsitektur Atomic Design yang konsisten.
---

# Frontend Coding Guidelines & Architecture Rules (`apps/e_voting`)

Dokumen ini adalah aturan resmi (*coding rules & guidelines*) untuk seluruh pengembangan frontend di `apps/e_voting`. Setiap agentic AI dan developer wajib mengikuti standar ini untuk menjaga konsistensi codebase.

---

## 1. Tech Stack & Dependencies

| Kategori | Teknologi | Versi |
| :--- | :--- | :--- |
| **UI Framework** | React | ^19 |
| **Language** | TypeScript | ~6.0 |
| **Bundler** | Vite | ^8.3 |
| **Styling** | Tailwind CSS v4 | ^4.3 |
| **Routing** | React Router | ^8.4 |
| **State Management** | Zustand (persisted) | ^5.0 |
| **HTTP Client** | Axios | ^1.20 |
| **Form Handling** | React Hook Form + Zod | ^7.89 / ^4.6 |
| **Form Resolver** | @hookform/resolvers | ^5.9 |
| **Toast / Notification** | Sonner | ^2.0 |
| **Icons** | Lucide React | ^1.49 |

---

## 2. Aturan Penulisan Kode (Code Style Rules)

### Aturan 1: Wajib Menggunakan Arrow Function

- **SEMUA komponen, hook, handler, dan fungsi utilitas** wajib ditulis menggunakan sintaks **Arrow Function** (`const fn = (...) => { ... }`).
- **DILARANG** menggunakan kata kunci `function` biasa (`function fn() { ... }`) maupun `export default function Component() { ... }`.
- Komponen React dideklarasikan sebagai `const ComponentName = (...) => { ... }` lalu diekspor di bagian bawah file.

```tsx
// ❌ SALAH
function LoginPage() { ... }
export default function DashboardPage() { ... }

// ✅ BENAR
const LoginPage = () => {
  // ...
};

export default LoginPage;
```

---

### Aturan 2: Ekspor Wajib di Paling Bawah File (Bottom Export) — `export default` untuk Komponen `.tsx`

- **SEMUA ekspor** (komponen, hook, utilitas/helper, interface, type, schema, store, service) **WAJIB diletakkan di baris-baris paling akhir file**.
- **DILARANG** melakukan inline export (seperti `export const Component = ...`, `export interface Props ...`, atau `export type Variant = ...`).
- **Aturan Khusus Komponen React (`.tsx`)**:
  - File `.tsx` yang mendefinisikan komponen React **WAJIB menggunakan default export di baris paling bawah**: `export default ComponentName;` (atau `export { ComponentName as default };`).
  - Dilarang mengekspor komponen via inline `export const ComponentName = ...`.
- **Aturan untuk File Non-Komponen**:
  - File tipe/interface (`.types.ts`): Menggunakan `export type { ... };` di baris paling akhir.
  - File skema validasi (`.schema.ts`): Menggunakan `export { schema };` dan `export type { FormData };` di baris paling akhir.
  - File service & utilitas (`*.service.ts`, `lib/axios.ts`): Menggunakan named export `export { fn1, fn2 };` di baris paling akhir.
  - File store Zustand (`use*Store.ts`): Menggunakan `export { use*Store };` dan `export type { ... };` di baris paling akhir.
- **Aturan untuk Barrel Re-Export Komponen (`index.ts`)**:
  - Setiap folder komponen mere-export default export dari file `.tsx` sekaligus menyediakan alias named export untuk fleksibilitas konsumen:
    ```ts
    export { default } from "./ComponentName";
    export { default as ComponentName } from "./ComponentName";
    export * from "./ComponentName.types";
    ```

```tsx
// ❌ SALAH (Inline export dilarang)
export const Badge = ({ children, variant = "default" }: BadgeProps) => { ... };
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> { ... }

// ❌ SALAH (Komponen .tsx dilarang menggunakan named export biasa)
const Badge = (...) => { ... };
export { Badge };

// ✅ BENAR (File .tsx komponen menggunakan default export di paling bawah)
import type { BadgeProps, BadgeVariant } from "./Badge.types";

const Badge = ({ children, variant = "default", icon, className = "", ...props }: BadgeProps) => {
  return (
    <span className="...">
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
```

---

### Aturan 3: Wajib Menggunakan `ref` sebagai Regular Prop (React 19 Native)

- Pada **React 19**, `forwardRef` sudah **usang (deprecated)** dan tidak digunakan lagi.
- Komponen React 19 dapat menerima `ref` langsung sebagai **regular prop** dalam parameter fungsi: `const Input = ({ ref, ...props }: InputProps) => { ... }`.
- **DILARANG** membungkus komponen dengan `forwardRef(...)` dan **TIDAK PERLU** lagi menambahkan `ComponentName.displayName = ...`.
- Semua **atom-level components** yang membungkus native HTML element (`<input>`, `<button>`, `<label>`, `<textarea>`, `<select>`) **WAJIB** mengekspos prop `ref?: Ref<HTML...Element>` pada interface props-nya agar kompatibel dengan `react-hook-form` `register()` dan ref forwarding konsumen.

```tsx
// src/components/atoms/Input/Input.types.ts
import type { InputHTMLAttributes, ReactNode, Ref } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>;
  isInvalid?: boolean;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
}

export type { InputProps };
```

```tsx
// src/components/atoms/Input/Input.tsx
import type { InputProps } from "./Input.types";

const Input = ({
  ref,
  className = "",
  isInvalid = false,
  leftElement,
  rightElement,
  disabled,
  ...props
}: InputProps) => {
  return (
    <input
      ref={ref}
      disabled={disabled}
      className={...}
      {...props}
    />
  );
};

export default Input;
```

- Komponen yang **TIDAK** membungkus elemen native secara langsung (seperti `Badge`, `FormField`, `AuthLayout`) tidak perlu mendefinisikan prop `ref`.

---

### Aturan 4: Strict Semantic Token — Dilarang Hardcode Warna

- **DILARANG KERAS** menggunakan hex code atau arbitrary Tailwind values dalam komponen (misalnya `bg-[#2563eb]`, `text-[#111827]`).
- Semua warna **WAJIB** menggunakan semantic token class dari `global.css` dan `DESIGN.md`.
- Referensi lengkap token tersedia di [`DESIGN.md`](file:///D:/e_voting/apps/e_voting/DESIGN.md).

```tsx
// ❌ SALAH
<div className="bg-[#2563eb] text-[#ffffff]">

// ✅ BENAR
<div className="bg-primary text-primary-foreground">
```

**Tabel Token Utama:**

| Kegunaan | Tailwind Class |
| :--- | :--- |
| Canvas / Background | `bg-background` |
| Teks utama | `text-foreground` |
| Kartu / Surface | `bg-card`, `text-card-foreground` |
| Muted fill & teks | `bg-muted`, `text-muted-foreground` |
| Hover | `bg-accent`, `hover:bg-accent` |
| Brand / CTA | `bg-primary`, `text-primary-foreground`, `hover:bg-primary-hover` |
| Destructive | `bg-destructive`, `text-destructive` |
| Border | `border-border`, `border-input`, `border-border-hover` |
| Focus ring | `focus:ring-ring` |

---

### Aturan 5: Typography Token

- **`font-heading`** (*Playfair Display*, serif) — Khusus untuk brand logo dan aksen identitas visual.
- **`font-sans`** (*Plus Jakarta Sans* / *Inter*) — Untuk seluruh UI: heading, body text, kontrol, tabel.

```tsx
// Brand logo
<span className="font-heading font-bold text-lg">E-Voting</span>

// Page heading
<h1 className="font-sans text-2xl font-bold">Dashboard Admin</h1>
```

---

### Aturan 6: Border Radius Scale

Konsisten menggunakan skala `rounded-*` sesuai hierarki elemen:

| Elemen | Class | Ukuran |
| :--- | :--- | :--- |
| Shell / Outer Dashboard | `rounded-3xl` | 24–28px |
| Cards & Widgets | `rounded-2xl` | 16–20px |
| Inputs & Controls | `rounded-xl` | 12px |
| Pills, Badges & Avatars | `rounded-full` | 9999px |

---

### Aturan 7: Frontend Bertanggung Jawab atas Trim & Sanitasi

- Sesuai aturan backend (backend TIDAK melakukan `.trim()`), **frontend wajib melakukan `.trim()` pada string input** sebelum mengirim ke API.
- Trimming dilakukan di dalam handler `onSubmit` atau pada level service, bukan di dalam atom `Input`.

```tsx
const onValidSubmit = async (data: LoginFormData) => {
  await onSubmit({
    username: data.username.trim(),
    password: data.password,
  });
};
```

---

### Aturan 8: Notifikasi Menggunakan Sonner Toast

- **DILARANG** menggunakan `alert()`, `window.confirm()`, atau library toast lain.
- Semua notifikasi sukses, error, dan informasi **WAJIB** menggunakan `toast` dari `sonner`.
- Pola standar: `toast.success(message)`, `toast.error(message)`.

```tsx
import { toast } from "sonner";

// Success
toast.success("Login berhasil!");

// Error
toast.error("Gagal melakukan autentikasi.");
```

- `<Toaster />` sudah dikonfigurasi global di `main.tsx` dengan `position="top-right"` dan `richColors`.

---

### Aturan 9: Error Handling pada API Call

- Setiap pemanggilan API **WAJIB** dibungkus `try/catch` dengan pola standar berikut:
- Axios error di-extract message dari `error.response.data.message`.
- Error ditampilkan ke user via `toast.error(...)`.

```tsx
try {
  const response = await someApi(payload);
  toast.success(response.message || "Berhasil!");
} catch (error) {
  const message =
    error instanceof Error ? error.message : "Terjadi kesalahan.";
  toast.error(message);
}
```

Pada layer **service**, error Axios di-rethrow dengan pesan yang user-friendly:

```tsx
import axios from "axios";

const loginApi = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    // simpan token & state...
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message as string, { cause: error });
    }
    throw error;
  }
};

export { loginApi };
```

---

### Aturan 10: Loading State pada Aksi Async

- Setiap tombol yang memicu operasi async (login, logout, submit form) **WAJIB** memiliki:
  1. State `isLoading` / `isSubmitting` menggunakan `useState`.
  2. Prop `isLoading` pada komponen `Button` (menampilkan spinner `Loader2` dan men-disable tombol).
  3. Blok `finally` untuk mereset state.

```tsx
const [isLoading, setIsLoading] = useState(false);

const handleAction = async () => {
  setIsLoading(true);
  try {
    await someApi();
    toast.success("Berhasil!");
  } catch (error) {
    toast.error("Gagal.");
  } finally {
    setIsLoading(false);
  }
};

<Button isLoading={isLoading} onClick={handleAction}>Submit</Button>
```

---

## 3. Arsitektur Komponen: Atomic Design

### Hierarki Komponen

```text
src/components/
├── atoms/        # Elemen primitif (Button, Input, Label, Badge, Avatar, Checkbox)
├── molecules/    # Kombinasi 2+ atom (FormField, SearchInput, NavItem, StatItem, LoadingState, EmptyState)
├── organisms/    # Blok fungsional (LoginForm, Sidebar, Header, DataTable, AdminDashboard, VoterDashboard)
├── layouts/      # Struktur shell & skeleton (AuthLayout, VoterDashboardLayout, AdminDashboardLayout, ProtectedRoute, PublicRoute)
└── pages/        # Route view + business logic + data fetching (LoginPage, VoterDashboardPage, AdminShellPage, NotFoundPage)
```

### Tanggung Jawab per Level

| Level | Tanggung Jawab | Boleh Mengandung |
| :--- | :--- | :--- |
| **Atom** | Elemen visual primitif, stateless/minimal state, reusable | Props, semantic tokens, prop `ref` jika native element (React 19) |
| **Molecule** | Gabungan 2+ atom menjadi unit fungsional kecil | Atom imports, minimal local state |
| **Organism** | Blok UI fungsional lengkap dengan form logic | Atom + Molecule imports, `react-hook-form`, `zod`, local state |
| **Layout** | Shell visual & route guard | Route logic (`Navigate`, `Outlet`), Zustand reads |
| **Page** | Komposisi organism + layout + data/API/navigasi | Semua level di bawahnya, `useState`, service calls, `useNavigate`, `toast` |

**Aturan Penting:**
- Atom **TIDAK BOLEH** mengimpor Molecule, Organism, Layout, atau Page.
- Molecule **TIDAK BOLEH** mengimpor Organism, Layout, atau Page.
- Page **TIDAK BOLEH** di-import oleh komponen non-Page; hanya oleh `main.tsx` router.

---

## 4. Struktur Folder Komponen & File Wajib

Setiap komponen **WAJIB** memiliki folder sendiri dengan 4 file minimum:

```text
src/components/{level}/{ComponentName}/
├── {ComponentName}.tsx         # Implementasi komponen (export default di baris akhir)
├── {ComponentName}.types.ts    # Interface, type alias, variant union types
├── {ComponentName}.md          # Dokumentasi co-located: purpose, props, tokens, code example
├── {ComponentName}.schema.ts   # (Opsional) Zod schema — hanya untuk form organisms
└── index.ts                    # Centralized re-export (export { default } & export { default as Name })
```

### 4.1 File `index.ts` — Centralized Re-Export

Setiap folder komponen **WAJIB** memiliki `index.ts` yang mere-export default export komponen dan types-nya:

```ts
// src/components/atoms/Badge/index.ts
export { default } from "./Badge";
export { default as Badge } from "./Badge";
export * from "./Badge.types";
```

Untuk organism dengan schema:
```ts
// src/components/organisms/LoginForm/index.ts
export { default } from "./LoginForm";
export { default as LoginForm } from "./LoginForm";
export * from "./LoginForm.types";
export * from "./LoginForm.schema";
```

### 4.2 Import Path — Selalu dari Folder Komponen

Konsumen dapat mengimpor menggunakan gaya named import maupun default import langsung dari folder komponen:

```tsx
// ✅ BENAR — Named import dari folder komponen
import { Badge, type BadgeProps } from "@/components/atoms/Badge";
import { LoginForm, type LoginCredentials } from "@/components/organisms/LoginForm";

// ✅ BENAR — Default import dari folder komponen
import Badge from "@/components/atoms/Badge";

// ❌ SALAH — Import langsung dari file internal
import Badge from "@/components/atoms/Badge/Badge";
import { BadgeProps } from "@/components/atoms/Badge/Badge.types";
```

### 4.3 Tidak Ada Root `components/index.ts`

**DILARANG** membuat file `src/components/index.ts` monolithic barrel export. Consumer import langsung dari folder masing-masing komponen untuk tree-shaking optimal dan batas modul yang jelas.

---

## 5. Pola File Types (`.types.ts`)

- Props interface di-extend dari native HTML attribute yang sesuai:
  - `HTMLAttributes<HTMLSpanElement>` untuk `Badge`
  - `ButtonHTMLAttributes<HTMLButtonElement>` untuk `Button`
  - `InputHTMLAttributes<HTMLInputElement>` untuk `Input`
  - `LabelHTMLAttributes<HTMLLabelElement>` untuk `Label`
- Komponen pembungkus elemen native menyertakan `ref?: Ref<HTML...Element>` (React 19).
- Variant union types didefinisikan sebagai `type` terpisah.
- Props kustom (tidak ada di native HTML) ditambahkan langsung di interface.
- **Wajib menggunakan bottom export (`export type { ... }`)**.

```tsx
// src/components/atoms/Button/Button.types.ts
import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export type { ButtonVariant, ButtonSize, ButtonProps };
```

- Komponen yang **tidak membungkus elemen native** cukup mendefinisikan interface mandiri:

```tsx
// src/components/molecules/FormField/FormField.types.ts
import type { ReactNode } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}

export type { FormFieldProps };
```

---

## 6. Pola Variant Styling (Variant Map)

Komponen dengan multiple visual variants menggunakan **Record map** untuk class mapping, bukan conditional ternary yang bertingkat:

```tsx
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm active:scale-[0.99]",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-accent active:scale-[0.99]",
  outline:
    "border border-border text-foreground bg-transparent hover:bg-accent active:scale-[0.99]",
  ghost:
    "text-foreground hover:bg-accent active:scale-[0.99]",
  destructive:
    "bg-destructive text-destructive-foreground hover:opacity-90 active:scale-[0.99]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs gap-1.5",
  md: "h-11 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
};
```

---

## 7. Struktur Folder Non-Komponen

```text
apps/e_voting/src/
├── components/         # Atomic Design hierarchy (lihat §3)
├── lib/                # Konfigurasi third-party client (Axios instance) + shared utilities
│   └── utils/          # Pure utility functions (e.g., date formatting, helpers)
├── services/           # API call functions & token management
├── stores/             # Zustand stores (state management)
├── hooks/              # Custom React hooks (state + lifecycle logic)
├── global.css          # Semantic design tokens & Tailwind v4 @theme bridge
└── main.tsx            # Entry point: Router, Toaster, StrictMode
```

### 7.1 `src/lib/` — Utility & Client Config

**`src/lib/utils/`** stores pure utility functions shared across multiple components (non-React, no side effects, no UI). Each utility lives in its own file with a descriptive name and barrel export.

```ts
// src/lib/utils/date.ts
const formatDate = (dateString?: string): string => {
  if (!dateString) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
};

export { formatDate };
```

### 7.2 `src/hooks/` — Custom React Hooks

**`src/hooks/`** stores custom React hooks that encapsulate state + lifecycle logic (e.g., `useLocalStorage`, `useDebounce`). Hooks must use arrow function syntax and bottom exports.

### 7.3 Aturan 11: Shared Function Harus di `lib/utils/` atau `hooks/`

> **Jika ada fungsi yang dibagi (shared) dan digunakan oleh lebih dari satu komponen, fungsi tersebut wajib disimpan di `src/lib/utils/` (untuk pure utility) atau `src/hooks/` (untuk React hooks). Dilarang menduplikat kode utilitas yang sama di dalam komponen.**

```tsx
// ❌ SALAH — Duplikat formatDate di dalam komponen
const AdminDashboard = () => {
  const formatDate = (dateString?: string): string => { ... };
};

const SuperAdminDashboard = () => {
  const formatDate = (dateString?: string): string => { ... }; // duplicated!
};

// ✅ BENAR — Import dari lib/utils
import { formatDate } from "@/lib/utils/date";
```

### 7.4 `src/lib/axios.ts` — Axios Instance (Client Config)

File konfigurasi third-party client seperti Axios instance beserta interceptors (menggunakan bottom export):

```tsx
// src/lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: lampirkan Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: hapus token jika 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
    }
    return Promise.reject(error);
  },
);

export { api };
```

### 7.2 `src/services/` — API Service Functions

- Setiap domain/feature memiliki file service terpisah (misalnya `auth.service.ts`, `election.service.ts`).
- Service mengimpor `api` dari `@/lib/axios` dan meng-export fungsi async di bagian bawah file.
- Service bertanggung jawab atas: pemanggilan API, penyimpanan token, sinkronisasi Zustand store, dan normalisasi error Axios.
- Service **TIDAK BOLEH** mengimpor komponen React atau menggunakan hook.

```tsx
// src/services/auth.service.ts
import axios from "axios";
import type { LoginCredentials } from "@/components/organisms/LoginForm";
import { useUserStore, type AuthUser } from "@/stores/useUserStore";
import { api } from "@/lib/axios";

interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
}

const TOKEN_KEY = "auth_token";

const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

const loginApi = async (
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    const data = response.data;
    setAuthToken(data.token);
    useUserStore.getState().setUser(data.user);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message as string, { cause: error });
    }
    throw error;
  }
};

const logoutApi = async (): Promise<void> => {
  removeAuthToken();
  useUserStore.getState().clearUser();
};

export type { LoginResponse };
export {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  loginApi,
  logoutApi,
};
```

### 7.3 `src/stores/` — Zustand Stores

- Nama file: `use{Domain}Store.ts` (camelCase dengan prefix `use`).
- Store dideklarasikan dengan `create` dari `zustand`.
- Persistensi menggunakan `persist` middleware ke `localStorage` dengan `createJSONStorage`.
- Wajib menggunakan bottom export: `export type { ... };` dan `export { use...Store };`.
- Barrel export melalui `src/stores/index.ts`.
- Derived getters (seperti `isSuperAdmin()`, `isAdmin()`, `isVoter()`) didefinisikan langsung di dalam store.

```tsx
// src/stores/useUserStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserRole = "SUPER_ADMIN" | "ADMIN" | "VOTER";

interface AuthUser {
  id: number;
  username: string;
  name: string;
  role: UserRole;
}

interface UserState {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
  isSuperAdmin: () => boolean;
  isAdmin: () => boolean;
  isVoter: () => boolean;
}

const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user: AuthUser) => set({ user }),
      clearUser: () => set({ user: null }),
      isSuperAdmin: () => get().user?.role === "SUPER_ADMIN",
      isAdmin: () => get().user?.role === "ADMIN",
      isVoter: () => get().user?.role === "VOTER",
    }),
    {
      name: "e-voting-user-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export type { UserRole, AuthUser, UserState };
export { useUserStore };
```

---

## 8. Routing & Route Guards

### 8.1 Entry Point (`main.tsx`)

- Routing dikonfigurasi secara terpusat di `main.tsx` menggunakan `BrowserRouter` + `Routes` + `Route` dari `react-router`.
- `<Toaster />` dari Sonner ditempatkan di luar `<BrowserRouter>` agar toast tetap muncul saat transisi halaman.
- Route guard diterapkan sebagai parent layout route (`<Route element={<Guard />}>`).

```tsx
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster position="top-right" richColors />
    <BrowserRouter>
      <Routes>
        {/* Rute publik (guest only) */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Rute admin & super admin (dengan Sidebar layout) */}
        <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]} />}>
          <Route element={<AdminShellPage />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          </Route>
        </Route>

        {/* Rute voter (dengan top navbar layout) */}
        <Route element={<ProtectedRoute allowedRoles={["VOTER"]} />}>
          <Route path="/voter/dashboard" element={<VoterDashboardPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
```

### 8.2 ProtectedRoute — RBAC Guard

- Memeriksa keberadaan token (`getAuthToken()`) DAN user state (`useUserStore`).
- Jika tidak terautentikasi → redirect ke `/login`.
- Jika terautentikasi tetapi role tidak diizinkan → redirect ke dashboard role yang sesuai.
- Render `<Outlet />` jika izin sah.

### 8.3 PublicRoute — Guest-Only Guard

- Jika sudah terautentikasi → redirect ke dashboard sesuai role.
- Jika belum login → render `<Outlet />` (tampilkan form login).

### 8.4 Konvensi URL Path

| Role | Dashboard Path |
| :--- | :--- |
| Super Admin | `/admin/dashboard` |
| Admin | `/admin/dashboard` |
| Voter | `/voter/dashboard` |

---

## 9. Pola Formulir (Form Patterns)

### 9.1 Stack Formulir

| Layer | Teknologi | Tugas |
| :--- | :--- | :--- |
| **Validasi schema** | Zod | Mendefinisikan aturan validasi + pesan error |
| **Form state** | React Hook Form | Mengelola field registration, submission, error state |
| **Bridge** | @hookform/resolvers (zodResolver) | Menghubungkan Zod schema ke RHF |
| **Visual field** | `<FormField>` molecule | Label + children + error/hint display |
| **Input element** | `<Input>` atom | Native input dengan prop `ref` (React 19) |

### 9.2 Zod Schema File (`{Form}.schema.ts`)

- Ditempatkan **co-located** di dalam folder organism form yang bersangkutan.
- Wajib menggunakan **bottom export**: deklarasikan schema dan tipe inferred terlebih dahulu, lalu export di paling bawah.

```tsx
// src/components/organisms/LoginForm/LoginForm.schema.ts
import { z } from "zod";

const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Username wajib diisi")
    .refine((val) => val.trim().length > 0, {
      message: "Username wajib diisi",
    }),
  password: z.string().min(1, "Password wajib diisi"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export type { LoginFormData };
export { loginSchema };
```

### 9.3 Form Setup di Organism

```tsx
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
  defaultValues: { username: "", password: "" },
  mode: "onTouched",  // Validasi saat field disentuh
});
```

---

## 10. Dokumentasi Komponen (`.md`)

Setiap komponen **WAJIB** memiliki file `.md` co-located yang mendokumentasikan:

1. **Level** — Atom / Molecule / Organism / Layout / Page.
2. **Purpose** — Deskripsi singkat tujuan komponen.
3. **Props** — Daftar props dengan variant/type.
4. **Semantic Tokens Used** — Mapping class ke `global.css`.
5. **Code Example** — Contoh penggunaan standar.

```markdown
# Badge Component

- **Level**: Atom
- **Folder**: `src/components/atoms/Badge/`

## Purpose
Inline status indicator pill for role badges, election status, and semantic labels.

## Props
- `variant`: `"default"` | `"success"` | `"warning"` | `"pending"` | `"info"` | `"secondary"`
- `icon`: `ReactNode` (optional leading icon)

## Semantic Tokens Used
- Success: `bg-success-subtle`, `text-success-subtle-foreground`
- Warning: `bg-warning-subtle`, `text-warning-subtle-foreground`

## Code Example
\```tsx
import { Badge } from "@/components/atoms/Badge";

<Badge variant="success">Active</Badge>
\```
```

---

## 11. Path Alias

Path alias `@/` dikonfigurasi di dua tempat dan merujuk ke `apps/e_voting/src/`:

**`vite.config.ts`** (untuk bundler):
```ts
resolve: {
  alias: {
    "@": path.resolve(import.meta.dirname, "./src"),
  },
},
```

**`tsconfig.app.json`** (untuk TypeScript):
```json
"paths": {
  "@/*": ["./src/*"]
}
```

Semua import internal **WAJIB** menggunakan `@/` prefix:
```tsx
import Button from "@/components/atoms/Button";
import { useUserStore } from "@/stores/useUserStore";
import { api } from "@/lib/axios";
```

---

## 12. Verifikasi & Quality Gate

Sebelum menganggap implementasi selesai, **WAJIB** menjalankan:

```bash
# Dari apps/e_voting/
npm run build    # tsc -b && vite build → harus 0 error
npm run lint     # eslint . → harus 0 warning/error
```

### Aturan TypeScript Ketat

- `noUnusedLocals: true` — Tidak boleh ada variabel/import yang tidak digunakan.
- `noUnusedParameters: true` — Tidak boleh ada parameter fungsi yang tidak digunakan.

### Aturan ESLint

- `preserve-caught-error` — Saat melempar `new Error` dari blok `catch`, wajib menyertakan `{ cause: error }`.

---

## 13. Implementasi Referensi (Reference Implementation: Sistem Auth)

### A. Atom: Button (`src/components/atoms/Button/`)

```tsx
import { Loader2 } from "lucide-react";
import type { ButtonProps, ButtonVariant, ButtonSize } from "./Button.types";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm active:scale-[0.99]",
  secondary: "bg-secondary text-secondary-foreground hover:bg-accent active:scale-[0.99]",
  outline: "border border-border text-foreground bg-transparent hover:bg-accent active:scale-[0.99]",
  ghost: "text-foreground hover:bg-accent active:scale-[0.99]",
  destructive: "bg-destructive text-destructive-foreground hover:opacity-90 active:scale-[0.99]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs gap-1.5",
  md: "h-11 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
};

const Button = ({
  ref,
  children,
  className = "",
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  fullWidth = false,
  disabled,
  type = "button",
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center font-medium rounded-xl
        transition-all duration-150 cursor-pointer select-none
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        ${variantClasses[variant]} ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
        ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}
        ${className}`.trim()}
      {...props}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-current" /> : icon}
      <span>{children}</span>
    </button>
  );
};

export default Button;
```

---

### B. Molecule: FormField (`src/components/molecules/FormField/`)

```tsx
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/atoms/Label";
import type { FormFieldProps } from "./FormField.types";

const FormField = ({
  id, label, required = false, optional = false,
  error, hint, className = "", children,
}: FormFieldProps) => {
  return (
    <div className={`flex flex-col w-full ${className}`.trim()}>
      <Label htmlFor={id} required={required} optional={optional}>
        {label}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`}
           className="flex items-center gap-1.5 mt-1.5 text-xs font-medium text-destructive">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
};

export default FormField;
```

---

### C. Layout: ProtectedRoute (`src/components/layouts/ProtectedRoute/`)

```tsx
import { Navigate, Outlet } from "react-router";
import { useUserStore } from "@/stores/useUserStore";
import { getAuthToken } from "@/services/auth.service";
import type { ProtectedRouteProps } from "./ProtectedRoute.types";

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const token = getAuthToken();
  const { user } = useUserStore();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "VOTER") {
      return <Navigate to="/voter/dashboard" replace />;
    }
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
```

---

### D. Page: LoginPage (`src/components/pages/LoginPage/`)

```tsx
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { LoginForm, type LoginCredentials } from "@/components/organisms/LoginForm";
import { loginApi } from "@/services/auth.service";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await loginApi(credentials);
      toast.success(response.message || "Login berhasil!");

      if (response.user.role === "VOTER") {
        navigate("/voter/dashboard");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal melakukan autentikasi.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Masuk ke Akun" subtitle="...">
      <LoginForm isLoading={isLoading} onSubmit={handleLoginSubmit} />
    </AuthLayout>
  );
};

export default LoginPage;
```

---

### E. Molecule: LoadingState (`src/components/molecules/LoadingState/`)

Reusable loading state component — replaces duplicated inline spinner markup across dashboard organisms. Uses CSS border animation (no icon dependency for the spinner itself).

```tsx
// LoadingState.types.ts
type LoadingSpinnerSize = "sm" | "md" | "lg";

interface LoadingStateProps {
  message?: string;
  spinnerSize?: LoadingSpinnerSize;
}

export type { LoadingSpinnerSize, LoadingStateProps };
```

```tsx
// LoadingState.tsx
const spinnerClasses: Record<"sm" | "md" | "lg", string> = {
  sm: "w-5 h-5 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-10 h-10 border-3",
};

const LoadingState = ({
  message = "Memuat...",
  spinnerSize = "md",
}: LoadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div
        className={`${spinnerClasses[spinnerSize]} border-primary border-t-transparent rounded-full animate-spin`}
      />
      <p className="text-sm text-muted-foreground font-medium">{message}</p>
    </div>
  );
};

export default LoadingState;
```

### F. Molecule: EmptyState (`src/components/molecules/EmptyState/`)

Reusable empty state component — replaces duplicated inline "no data" markup across dashboard organisms.

```tsx
// EmptyState.types.ts
import type { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
}

export type { EmptyStateProps };
```

```tsx
// EmptyState.tsx
import { Layers } from "lucide-react";
import type { EmptyStateProps } from "./EmptyState.types";

const EmptyState = ({
  title = "Tidak Ada Data",
  description = "Tidak ada data untuk ditampilkan saat ini.",
  icon,
}: EmptyStateProps) => {
  return (
    <div className="bg-card rounded-3xl border border-border p-12 text-center space-y-4 shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
        {icon || <Layers className="w-8 h-8" />}
      </div>
      <div className="space-y-1 max-w-md mx-auto">
        <h2 className="font-sans text-lg font-bold text-card-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default EmptyState;
```

---

## 14. Naming Convention Summary

| Entitas | Konvensi | Contoh |
| :--- | :--- | :--- |
| Komponen | PascalCase | `LoginForm`, `VoterDashboardPage`, `AdminShellPage`, `LoadingState`, `EmptyState`, `Badge` |
| File komponen | PascalCase.tsx (export default di bawah) | `LoginForm.tsx` |
| File types | PascalCase.types.ts (export type {...}) | `LoginForm.types.ts` |
| File schema | PascalCase.schema.ts | `LoginForm.schema.ts` |
| File docs | PascalCase.md | `LoginForm.md` |
| File barrel index | index.ts (export { default } & export { default as Name }) | `index.ts` |
| Zustand store | camelCase `use*Store` | `useUserStore.ts` |
| Service file | camelCase `*.service.ts` | `auth.service.ts` |
| Library file | camelCase | `axios.ts` |
| CSS variables | kebab-case `--name` | `--primary-hover` |
| Tailwind classes | kebab-case | `bg-primary-hover` |
| Props interface | PascalCase `*Props` | `ButtonProps`, `LoginFormProps` |
| Variant type | PascalCase `*Variant` | `ButtonVariant`, `BadgeVariant` |
| Handler functions | camelCase `handle*` | `handleLogout`, `handleLoginSubmit` |
| API functions | camelCase `*Api` | `loginApi`, `logoutApi` |
