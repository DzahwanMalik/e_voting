---
name: backend-guidelines
description: Standar konvensi kode, struktur folder, dan aturan implementasi untuk backend Express + TypeScript (apps/server). Wajib menggunakan arrow function, bottom exports, dan arsitektur berlapis yang konsisten.
---

# Backend Coding Guidelines & Architecture Rules (`apps/server`)

Dokumen ini adalah aturan resmi (*coding rules & guidelines*) untuk seluruh pengembangan backend di `apps/server`. Setiap agentic AI dan developer wajib mengikuti standar ini untuk menjaga konsistensi codebase.

---

## 1. Aturan Penulisan Kode (Code Style Rules)

### Aturan 1: Wajib Menggunakan Arrow Function
- **SEMUA fungsi** (controller, middleware, service, utilitas/helper, listener, dan callback) **WAJIB** ditulis menggunakan sintaks **Arrow Function** (`const fn = (...) => { ... }`).
- **DILARANG** menggunakan kata kunci `function` biasa (`function fn() { ... }`).
- Tipe parameter dan kembalian (*return type*) harus didefinisikan secara eksplisit.

```typescript
// ❌ SALAH (Dilarang menggunakan function keyword)
function login(req: Request, res: Response): Promise<void> { ... }
export function authenticate(req: Request, res: Response, next: NextFunction) { ... }

// ✅ BENAR (Gunakan Arrow Function)
const login = async (req: Request, res: Response): Promise<void> => {
  // logic
};

const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  // logic
};
```

---

### Aturan 2: Ekspor Wajib di Paling Bawah File (Bottom Export)
- **SEMUA ekspor** (baik named export maupun default export) **WAJIB diletakkan di baris-baris paling akhir file**.
- **DILARANG** melakukan inline export (seperti `export const ...`, `export function ...`, atau `export default class ...`).
- Deklarasikan interface/type/konstanta/fungsi terlebih dahulu, lalu kumpulkan semua yang diekspor di bagian bawah.

```typescript
// ❌ SALAH (Inline export)
export const hashPassword = async (plain: string) => { ... };
export const comparePassword = async (plain: string, hashed: string) => { ... };

// ✅ BENAR (Deklarasi di atas, export di paling bawah)
const hashPassword = async (plainText: string): Promise<string> => {
  return bcrypt.hash(plainText, SALT_ROUNDS);
};

const comparePassword = async (plainText: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(plainText, hashed);
};

export { hashPassword, comparePassword };
```

Untuk default export:
```typescript
// ✅ BENAR
const router = Router();
// konfigurasi route...

export default router;
```

---

## 2. Struktur Folder & Fungsi Masing-Masing Folder

Berikut hierarki folder di dalam `apps/server/src`:

```text
apps/server/
├── prisma/
│   ├── schema.prisma          # Definisi schema database & relasi
│   └── seed.ts                # Seeder data awal (misal Super Admin)
├── src/
│   ├── controllers/           # HTTP Request & Response Handlers
│   ├── middlewares/           # Middleware Express (Auth, RBAC, Validation)
│   ├── routes/                # Definisi Endpoint URL & Routing Express
│   ├── services/              # Logika Bisnis Inti & Operasi Data Kompleks
│   ├── utils/                 # Fungsi Helper Murni (JWT, Hash, Date, dll)
│   ├── types/                 # Type Definitions & Express Namespace Extension
│   ├── lib/                   # Inisialisasi Third-party Client/Singleton (Prisma)
│   ├── generated/             # Auto-generated Prisma Client (JANGAN diedit manual)
│   └── index.ts               # Entry point aplikasi Express
```

### Penjelasan & Tanggung Jawab Tiap Folder:

1. **`src/controllers/`**
   - **Fungsi:** Menerima input dari HTTP request (`req.body`, `req.params`, `req.query`), memvalidasi input dasar, memanggil service/database, dan mengembalikan HTTP response (`res.status(...).json(...)`).
   - **Prinsip:** Tidak boleh memuat logic bisnis yang rumit; controller fokus pada orkestrasi input/output HTTP.

2. **`src/middlewares/`**
   - **Fungsi:** Menyaring atau memproses request sebelum diteruskan ke controller.
   - **Contoh:** `auth.middleware.ts` untuk verifikasi token JWT, `role.middleware.ts` untuk verifikasi role (RBAC), error handling middleware.

3. **`src/routes/`**
   - **Fungsi:** Mendaftarkan path URL dan HTTP verb (`GET`, `POST`, `PUT`, `DELETE`).
   - **Prinsip:** Menggabungkan endpoint dengan middleware pengaman dan controller yang bersangkutan.

4. **`src/services/`**
   - **Fungsi:** Menyimpan business logic murni (misal: verifikasi kelayakan voter, penghitungan suara, aturan relasi).
   - **Prinsip:** Tidak boleh bergantung pada objek `req` atau `res` Express agar logic bisa diuji secara modular (*unit testable*).

5. **`src/utils/`**
   - **Fungsi:** Menyimpan fungsi-fungsi bantuan (*helper functions*) yang tidak terikat dengan domain bisnis tertentu.
   - **Contoh:** `jwt.ts` (sign & verify token), `password.ts` (hashing).

6. **`src/types/`**
   - **Fungsi:** Menyimpan definisi TypeScript (interface, type alias, deklarasi global).
   - **Contoh:** `express.d.ts` untuk menambahkan properti `user` pada `Express.Request`.

7. **`src/lib/`**
   - **Fungsi:** Inisialisasi dan konfigurasi pustaka eksternal atau koneksi database.
   - **Contoh:** `prisma.ts` yang menginisialisasi adapter PostgreSQL dan instance `PrismaClient`.

---

## 3. Implementasi Referensi (Reference Implementation: Sistem Auth)

Berikut adalah contoh standar implementasi sistem autentikasi yang sudah memenuhi aturan di atas:

### A. Utilitas Password (`src/utils/password.ts`)
```typescript
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const hashPassword = async (plainText: string): Promise<string> => {
  return bcrypt.hash(plainText, SALT_ROUNDS);
};

const comparePassword = async (plainText: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(plainText, hashed);
};

export { hashPassword, comparePassword };
```

---

### B. Utilitas JWT (`src/utils/jwt.ts`)
```typescript
import jwt from "jsonwebtoken";
import { UserRole } from "../generated/prisma/enums";

interface JwtPayload {
  userId: number;
  username: string;
  name: string;
  role: UserRole;
}

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export type { JwtPayload };
export { generateToken, verifyToken };
```

---

### C. Type Extension (`src/types/express.d.ts`)
```typescript
import { JwtPayload } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
```

---

### D. Middleware Autentikasi (`src/middlewares/auth.middleware.ts`)
```typescript
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Akses ditolak. Token tidak disediakan." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token tidak valid atau telah kedaluwarsa." });
  }
};

export { authenticate };
```

---

### E. Middleware Otorisasi Role (`src/middlewares/role.middleware.ts`)
```typescript
import { Request, Response, NextFunction } from "express";
import { UserRole } from "../generated/prisma/enums";

const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ message: "Forbidden: Anda tidak memiliki akses ke resource ini." });
      return;
    }

    next();
  };
};

export { requireRole };
```

---

### F. Controller Auth (`src/controllers/auth.controller.ts`)
```typescript
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: "Username dan password wajib diisi." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      res.status(401).json({ message: "Username atau password salah." });
      return;
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Username atau password salah." });
      return;
    }

    const token = generateToken({
      userId: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    });

    res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Tidak terautentikasi." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

export { login, getMe };
```

---

### G. Routing Auth (`src/routes/auth.routes.ts`)
```typescript
import { Router } from "express";
import { login, getMe } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", login);
router.get("/me", authenticate, getMe);

export default router;
```
