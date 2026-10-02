# Backend Coding Rules & Architecture Guidelines (`apps/server`)

Seluruh kode backend di `apps/server` WAJIB mematuhi aturan penulisan dan struktur berikut:

## 1. Aturan Penulisan Kode (Coding Style)

1. **Wajib Arrow Function**:
   - Seluruh fungsi (controller, middleware, service, utils/helper, dan route callback) **WAJIB** menggunakan sintaks **Arrow Function** (`const fn = (...) => { ... }`).
   - Dilarang keras menggunakan kata kunci `function` biasa (`function fn() { ... }`).

2. **Ekspor Selalu di Paling Bawah (Bottom Export)**:
   - Semua export (baik `export default` maupun named export `export { ... }`) **WAJIB** berada di baris-baris paling akhir file.
   - Dilarang melakukan inline export (seperti `export const ...` atau `export function ...`).
   - Deklarasikan variabel, tipe, atau fungsi terlebih dahulu, lalu ekspor bersamaan di bagian bawah file.

3. **Strict TypeScript Typing**:
   - Berikan tipe parameter dan return type secara eksplisit pada setiap arrow function (misal: `(req: Request, res: Response): Promise<void> => { ... }`).

---

## 2. Struktur Folder & Tanggung Jawab (`src/`)

- `src/controllers/` : Menangani HTTP request & response (`req.body`, `req.params`), memanggil service/model, mengembalikan status code dan json. Dilarang memuat logic bisnis yang rumit.
- `src/middlewares/` : Pencegat HTTP request sebelum sampai controller (autentikasi JWT, otorisasi role/RBAC, validasi body, error handler).
- `src/routes/` : Definisi endpoint URL dan HTTP method (`Router()`), menghubungkan middleware dan controller.
- `src/services/` : Logika bisnis inti dan query database kompleks (independen dari Express `req`/`res`).
- `src/utils/` : Fungsi utilitas/helper murni yang reusable (misal: JWT sign/verify, hashing password).
- `src/types/` : Interface kustom, type definitions, dan file type declaration (seperti `express.d.ts`).
- `src/lib/` : Inisialisasi client library pihak ketiga atau singleton (seperti `prisma.ts`).
- `src/generated/` : File client yang di-generate oleh Prisma (dilarang diedit langsung).
- `src/index.ts` : Entry point aplikasi Express, konfigurasi global middleware, inisialisasi route, dan server listen.

---

## 3. Contoh Standar Kode

```typescript
// src/utils/example.ts
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const hashPassword = async (plainText: string): Promise<string> => {
  return bcrypt.hash(plainText, SALT_ROUNDS);
};

const comparePassword = async (plainText: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(plainText, hashed);
};

// Export selalu di paling bawah
export { hashPassword, comparePassword };
```

```typescript
// src/routes/example.routes.ts
import { Router } from "express";
import { login } from "../controllers/auth.controller";

const router = Router();

router.post("/login", login);

// Export selalu di paling bawah
export default router;
```
