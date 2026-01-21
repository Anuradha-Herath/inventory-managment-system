'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated && !token) {
      // Double-check localStorage as fallback
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!storedToken) {
        router.push('/login');
      }
    }
  }, [mounted, isAuthenticated, token, router]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated && !token) {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!storedToken) {
      return null;
    }
  }

  return <>{children}</>;
}
