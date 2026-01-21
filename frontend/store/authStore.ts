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
          isAuthenticated: !!response.token && !!user,
        });
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('auth-storage');
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },
      setUser: (user: User) => {
        const currentToken = useAuthStore.getState().token;
        set({ 
          user,
          isAuthenticated: !!currentToken && !!user,
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
