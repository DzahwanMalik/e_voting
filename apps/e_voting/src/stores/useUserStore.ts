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
