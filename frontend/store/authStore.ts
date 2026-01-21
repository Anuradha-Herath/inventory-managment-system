import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { JwtResponse, User } from '@/types';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (response: JwtResponse) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (response: JwtResponse) => {
        localStorage.setItem('token', response.token);
        const user: User = {
          id: response.id,
          username: response.username,
          email: response.email,
          firstName: '',
          lastName: '',
          role: response.role as any,
          active: true,
          createdAt: '',
          updatedAt: '',
        };
        set({
          token: response.token,
          user,
          isAuthenticated: true,
        });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },
      setUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
