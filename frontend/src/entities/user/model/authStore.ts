import { create } from 'zustand';
import { setAccessToken, onAuthFailure, logoutRequest } from '../../../shared/api/client';
import type { User } from '../../../shared/types/domain';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  restoreSession: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user, accessToken) => {
    setAccessToken(accessToken);
    if (import.meta.env.DEV) console.log('[authStore] login', user.email);
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    setAccessToken(null);
    if (import.meta.env.DEV) console.log('[authStore] logout');
    set({ user: null, isAuthenticated: false });
    void logoutRequest();
  },
  updateUser: (user) => set({ user }),
  restoreSession: (user) => {
    if (import.meta.env.DEV) console.log('[authStore] session restored', user.email);
    set({ user, isAuthenticated: true });
  },
}));

onAuthFailure(() => useAuthStore.getState().logout());
