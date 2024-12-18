import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  userId: number | null;
  isAdmin: boolean;
  setAuth: (userId: number | null, isAdmin: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      isAdmin: false,
      setAuth: (userId, isAdmin) => set({ userId, isAdmin }),
      logout: () => set({ userId: null, isAdmin: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
