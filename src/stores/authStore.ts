import { create } from 'zustand';
import type { AuthUser } from '@/types/api';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
  updateUser: (user: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('auth_token'),
  user: (() => {
    try {
      const u = localStorage.getItem('auth_user');
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  })(),
  isAuthenticated: !!localStorage.getItem('auth_token'),

  setAuth: (token, user) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    set({ token: null, user: null, isAuthenticated: false });
  },

  updateUser: (partial) => {
    set((state) => {
      const updated = state.user ? { ...state.user, ...partial } : null;
      if (updated) localStorage.setItem('auth_user', JSON.stringify(updated));
      return { user: updated };
    });
  },
}));

// Listen for forced logout from API interceptor
window.addEventListener('auth:logout', () => {
  useAuthStore.getState().logout();
});
