import { prisma } from "../lib/prisma";
import { UserRole } from "../generated/prisma/enums";
import { AppError } from "../utils/app-error";

interface AdminUser {
  id: number;
  username: string;
  name: string | null;
  role: UserRole;
  createdAt: Date;
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
    },
    orderBy: { createdAt: "desc" },
  });
};

export type { AdminUser };
export { getAllAdmins };
