"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebaseAuth } from '@/contexts/firebase-auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('patient' | 'doctor')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, loading } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
        return;
      }

      if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.push('/dashboard'); // Redirect to dashboard if role not allowed
        return;
      }
    }
  }, [user, loading, router, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null; // Will redirect to dashboard
  }

  return <>{children}</>;
};
