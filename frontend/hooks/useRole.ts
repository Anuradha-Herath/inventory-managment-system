import { useAuthStore } from '@/store/authStore';

export const useRole = () => {
  const { user } = useAuthStore();
  
  return {
    isAdmin: user?.role === 'ADMIN',
    isStaff: user?.role === 'STAFF',
    role: user?.role,
    user,
  };
};
