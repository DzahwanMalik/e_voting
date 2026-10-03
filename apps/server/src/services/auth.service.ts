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
