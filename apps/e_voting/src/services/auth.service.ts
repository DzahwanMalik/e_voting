import axios from "axios";
import type { LoginCredentials } from "@/components/organisms/LoginForm";
import { useUserStore, type AuthUser } from "@/stores/useUserStore";
import { api } from "@/lib/axios";

export interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
}

const TOKEN_KEY = "auth_token";

// --- Token Management (localStorage) ---
export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// --- Authentication API with Axios ---
export const loginApi = async (
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    const data = response.data;

    // 1. Simpan Token ke localStorage
    setAuthToken(data.token);

    // 2. Simpan Data User secara Reaktif ke Zustand Store
    useUserStore.getState().setUser(data.user);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message as string, { cause: error });
    }
    throw error;
  }
};

export const logoutApi = async (): Promise<void> => {
  // 1. Hapus Token dari localStorage
  removeAuthToken();

  // 2. Bersihkan State User di Zustand Store
  useUserStore.getState().clearUser();
};
