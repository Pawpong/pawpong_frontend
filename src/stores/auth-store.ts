import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  role: 'adopter' | 'breeder';
  verificationStatus?: VerificationStatus; // 브리더 전용
}

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setUser: (user: AuthUser | null) => void;
  setVerificationStatus: (status: VerificationStatus) => void;
  clearAuth: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hasHydrated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setVerificationStatus: (status) =>
        set((state) => ({
          user: state.user ? { ...state.user, verificationStatus: status } : null,
        })),
      clearAuth: () => set({ user: null, isAuthenticated: false }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
