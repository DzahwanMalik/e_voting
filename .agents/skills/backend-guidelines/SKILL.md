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

### Aturan 3: Backend Tidak Perlu Melakukan Trim Payload
- Sanitasi dan pembersihan spasi (*trimming*) pada string payload (seperti `title`, `username`, `name`, `description`) **sepenuhnya dihandle di Frontend**.
- Backend **TIDAK PERLU** memanggil `.trim()` pada data request body.
- Backend hanya fokus pada validasi keberadaan (*presence*) dan tipe data (*type check*):
  - Memastikan field wajib ada dan bertipe string (`!title || typeof title !== "string"`).
  - Tidak memutasi atau memangkas string yang dikirim oleh client.

---

### Aturan 4: Hindari Penggunaan `select` Redundan pada Query Prisma
- Secara default, Prisma Client otomatis mengembalikan **seluruh field skalar** (*all scalar fields*) dari model saat query dijalankan tanpa blok `select`.
- **DILARANG** menggunakan blok `select` jika tujuannya hanya mendaftar ulang seluruh field skalar yang dimiliki model tersebut.
- Blok `select` **HANYA DIGUNAKAN** untuk:
  1. **Menyembunyikan field sensitif**, seperti mengecualikan kolom `password` pada model `User`.
  2. **Memilih sebagian field dari tabel relasi**, misalnya `user: { select: { id: true, name: true } }`.
  3. **Optimasi payload**, jika model memiliki kolom teks/binary berukuran sangat besar yang tidak dibutuhkan.
  4. **Kebutuhan agregasi/counting**, seperti `_count: { select: { candidates: true } }`.

```typescript
// ❌ SALAH (Redundan: mendaftar ulang seluruh field Election)
return prisma.election.create({
  data: { title, description },
  select: {
    id: true,
    title: true,
    description: true,
    createdAt: true,
    updatedAt: true,
  },
});

// ✅ BENAR (Bersih, ringkas, otomatis mengambil semua field skalar)
return prisma.election.create({
  data: { title, description },
});

// ✅ BENAR (Tepat: memakai select untuk mengecualikan password User)
return prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    username: true,
    name: true,
    role: true,
    createdAt: true,
  },
});
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
│   ├── utils/                 # Fungsi Helper Murni (JWT, Hash, Error, dll)
│   ├── types/                 # Type Definitions & Express Namespace Extension
│   ├── lib/                   # Inisialisasi Third-party Client/Singleton (Prisma)
│   ├── generated/             # Auto-generated Prisma Client (JANGAN diedit manual)
│   └── index.ts               # Entry point aplikasi Express
```

### Penjelasan & Tanggung Jawab Tiap Folder:

1. **`src/controllers/`**
   - **Fungsi:** Menerima input dari HTTP request (`req.body`, `req.params`, `req.query`), memvalidasi input dasar (tipe data, format), memanggil layer service, dan mengembalikan HTTP response (`res.status(...).json(...)`).
   - **Prinsip:** Tidak boleh memuat logic bisnis yang rumit ataupun menyentuh query database Prisma secara langsung; controller fokus pada orkestrasi input/output HTTP dan pemetaan status code.

2. **`src/services/`**
   - **Fungsi:** Menyimpan business logic murni (misal: verifikasi kredensial user, verifikasi kelayakan voter, kalkulasi suara, transaksi database atomik).
   - **Prinsip:** Tidak boleh bergantung pada objek `req` atau `res` Express agar business logic tetap murni (*framework-agnostic*), terisolasi (*decoupled*), dan dapat digunakan kembali secara fleksibel di luar konteks HTTP (seperti script seeder, cron job, worker, atau CLI).

3. **`src/middlewares/`**
   - **Fungsi:** Menyaring atau memproses request sebelum diteruskan ke controller.
   - **Contoh:** `auth.middleware.ts` untuk verifikasi token JWT, `role.middleware.ts` untuk verifikasi role (RBAC).

4. **`src/routes/`**
   - **Fungsi:** Mendaftarkan path URL dan HTTP verb (`GET`, `POST`, `PUT`, `DELETE`).
   - **Prinsip:** Menggabungkan endpoint dengan middleware pengaman dan controller yang bersangkutan.

5. **`src/utils/`**
   - **Fungsi:** Menyimpan fungsi-fungsi bantuan (*helper functions*) yang tidak terikat dengan domain bisnis tertentu.
   - **Contoh:** `jwt.ts` (sign & verify token), `password.ts` (hashing), `app-error.ts` (standarisasi error).

6. **`src/types/`**
   - **Fungsi:** Menyimpan definisi TypeScript (interface, type alias, deklarasi global).
   - **Contoh:** `express.d.ts` untuk menambahkan properti `user` pada `Express.Request`.

7. **`src/lib/`**
   - **Fungsi:** Inisialisasi dan konfigurasi pustaka eksternal atau koneksi database.
   - **Contoh:** `prisma.ts` yang menginisialisasi adapter PostgreSQL dan instance `PrismaClient`.

---

## 3. Implementasi Referensi (Reference Implementation: Sistem Auth)

Berikut adalah contoh standar implementasi sistem autentikasi yang memenuhi arsitektur berlapis (Route -> Middleware -> Controller -> Service -> DB) dan aturan kode di atas:

### A. Utilitas Password (`src/utils/password.ts`)
```typescript
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const hashPassword = async (plainText: string): Promise<string> => {
  return bcrypt.hash(plainText, SALT_ROUNDS);
};

const comparePassword = async (
  plainText: string,
  hashed: string,
): Promise<boolean> => {
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
  role: UserRole;
}

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as NonNullable<jwt.SignOptions["expiresIn"]>,
  });
};

const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export type { JwtPayload };
export { generateToken, verifyToken };
```

---

### C. Helper Error Standar (`src/utils/app-error.ts`)
```typescript
class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

export { AppError, isAppError };
```

---

### D. Type Extension (`src/types/express.d.ts`)
```typescript
import type { JwtPayload } from "../utils/jwt";

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

### E. Middleware Autentikasi (`src/middlewares/auth.middleware.ts`)
```typescript
import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Akses ditolak. Token tidak disediakan." });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Format token tidak valid." });
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    res
      .status(401)
      .json({ message: "Token tidak valid atau telah kedaluwarsa." });
  }
};

export { authenticate };
```

---

### F. Middleware Otorisasi Role (`src/middlewares/role.middleware.ts`)
```typescript
import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../generated/prisma/enums";

const requireRole = (
  ...allowedRoles: UserRole[]
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi!" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        message: "Forbidden: Anda tidak memiliki akses ke resource ini.",
      });
      return;
    }

    next();
  };
};

export { requireRole };
```

---

### G. Service Auth (`src/services/auth.service.ts`)
```typescript
import { prisma } from "../lib/prisma";
import { comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";
import { AppError } from "../utils/app-error";
import { UserRole } from "../generated/prisma/enums";

interface LoginInput {
  username: string;
  password: string;
}

interface AuthUser {
  id: number;
  username: string;
  name: string;
  role: UserRole;
  createdAt?: Date;
}

interface LoginResult {
  token: string;
  user: AuthUser;
}

const loginUser = async (input: LoginInput): Promise<LoginResult> => {
  const user = await prisma.user.findUnique({
    where: { username: input.username },
  });

  if (!user) {
    throw new AppError("Username atau password salah.", 401);
  }

  const isPasswordValid = await comparePassword(input.password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Username atau password salah.", 401);
  }

  const token = generateToken({
    userId: user.id,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    },
  };
};

const getCurrentUser = async (userId: number): Promise<AuthUser> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError("User tidak ditemukan.", 404);
  }

  return user;
};

export type { LoginInput, AuthUser, LoginResult };
export { loginUser, getCurrentUser };
```

---

### H. Controller Auth (`src/controllers/auth.controller.ts`)
```typescript
import type { Request, Response } from "express";
import { isAppError } from "../utils/app-error";
import * as authService from "../services/auth.service";

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: "Username dan password wajib diisi." });
      return;
    }

    const { token, user } = await authService.loginUser({
      username,
      password,
    });

    res.status(200).json({
      message: "Login berhasil",
      token,
      user,
    });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Login error:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Tidak terautentikasi" });
      return;
    }

    const user = await authService.getCurrentUser(req.user.userId);

    res.status(200).json({ user });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

export { login, getMe };
```

---

### I. Routing Auth (`src/routes/auth.routes.ts`)
```typescript
import { Router } from "express";
import { login, getMe } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", login);
router.get("/me", authenticate, getMe);

export default router;
```
