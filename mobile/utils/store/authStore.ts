import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  email: string;
}

interface AuthState {
  sessionToken: string | null;
  user: User | null;
  hasProfile: boolean;
  setSession: (token: string, user: User) => void;
  setHasProfile: (hasProfile: boolean) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      sessionToken: null,
      user: null,
      hasProfile: false,
      setSession: (token, user) => set({ sessionToken: token, user }),
      setHasProfile: (hasProfile) => set({ hasProfile }),
      clearSession: () => set({ sessionToken: null, user: null, hasProfile: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
