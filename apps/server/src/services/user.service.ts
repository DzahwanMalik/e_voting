import { prisma } from "../lib/prisma";
import { UserRole } from "../generated/prisma/enums";
import { AppError } from "../utils/app-error";
import { hashPassword } from "../utils/password";

interface AdminUser {
  id: number;
  username: string;
  name: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateAdminInput {
  username: string;
  password: string;
  name: string;
}

interface UpdateAdminInput {
  name?: string;
  username?: string;
  password?: string;
}

const getAllAdmins = async (role: UserRole): Promise<AdminUser[]> => {
  if (role !== UserRole.SUPER_ADMIN) {
    throw new AppError(
      "Forbidden: Hanya Super Admin yang dapat melihat daftar admin.",
      403,
    );
  }

  return prisma.user.findMany({
    where: { role: UserRole.ADMIN },
    select: {
      id: true,
      username: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const createAdmin = async (
  input: CreateAdminInput,
  creatorId: number,
  creatorRole: UserRole,
): Promise<AdminUser> => {
  if (creatorRole !== UserRole.SUPER_ADMIN) {
    throw new AppError(
      "Forbidden: Hanya Super Admin yang dapat membuat admin.",
      403,
    );
  }

  if (!input.username || typeof input.username !== "string") {
    throw new AppError("Username admin wajib diisi.", 400);
  }

  if (!input.password || typeof input.password !== "string") {
    throw new AppError("Password admin wajib diisi.", 400);
  }

  if (!input.name || typeof input.name !== "string") {
    throw new AppError("Nama admin wajib diisi.", 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: { username: input.username },
  });

  if (existingUser) {
    throw new AppError("Username sudah terdaftar.", 409);
  }

  const hashedPassword = await hashPassword(input.password);

  return prisma.user.create({
    data: {
      username: input.username,
      password: hashedPassword,
      name: input.name,
      role: UserRole.ADMIN,
      createdById: creatorId,
    },
    select: {
      id: true,
      username: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const getAdminById = async (
  adminId: number,
  role: UserRole,
): Promise<AdminUser> => {
  if (role !== UserRole.SUPER_ADMIN) {
    throw new AppError(
      "Forbidden: Hanya Super Admin yang dapat melihat detail admin.",
      403,
    );
  }

  const admin = await prisma.user.findUnique({
    where: {
      id: adminId,
      role: UserRole.ADMIN,
    },
    select: {
      id: true,
      username: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!admin) {
    throw new AppError("Admin tidak ditemukan.", 404);
  }

  return admin;
};

const updateAdmin = async (
  adminId: number,
  input: UpdateAdminInput,
  role: UserRole,
): Promise<AdminUser> => {
  if (role !== UserRole.SUPER_ADMIN) {
    throw new AppError(
      "Forbidden: Hanya Super Admin yang dapat mengubah admin.",
      403,
    );
  }

  const admin = await prisma.user.findUnique({
    where: {
      id: adminId,
      role: UserRole.ADMIN,
    },
  });

  if (!admin) {
    throw new AppError("Admin tidak ditemukan.", 404);
  }

  const updateData: {
    name?: string;
    username?: string;
    password?: string;
  } = {};

  if (input.name !== undefined) {
    if (typeof input.name !== "string" || input.name === "") {
      throw new AppError("Nama admin tidak boleh kosong.", 400);
    }
    updateData.name = input.name;
  }

  if (input.username !== undefined) {
    if (typeof input.username !== "string" || input.username === "") {
      throw new AppError("Username admin tidak boleh kosong.", 400);
    }

    if (input.username !== admin.username) {
      const existing = await prisma.user.findUnique({
        where: { username: input.username },
      });

      if (existing) {
        throw new AppError("Username sudah terdaftar.", 409);
      }
    }

    updateData.username = input.username;
  }

  if (input.password !== undefined) {
    if (typeof input.password !== "string" || input.password === "") {
      throw new AppError("Password tidak boleh kosong.", 400);
    }

    updateData.password = await hashPassword(input.password);
  }

  return prisma.user.update({
    where: { id: adminId },
    data: updateData,
    select: {
      id: true,
      username: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const deleteAdmin = async (
  adminId: number,
  role: UserRole,
): Promise<void> => {
  if (role !== UserRole.SUPER_ADMIN) {
    throw new AppError(
      "Forbidden: Hanya Super Admin yang dapat menghapus admin.",
      403,
    );
  }

  const admin = await prisma.user.findUnique({
    where: {
      id: adminId,
      role: UserRole.ADMIN,
    },
  });

  if (!admin) {
    throw new AppError("Admin tidak ditemukan.", 404);
  }

  await prisma.user.delete({
    where: { id: adminId },
  });
};

export type { AdminUser, CreateAdminInput, UpdateAdminInput };
export { getAllAdmins, createAdmin, getAdminById, updateAdmin, deleteAdmin };
