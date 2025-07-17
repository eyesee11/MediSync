"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  name: string;
  role: 'doctor' | 'patient';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicRoutes = ['/login', '/'];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else if (!publicRoutes.includes(pathname)) {
        router.push('/login');
      }
    } catch (error) {
        console.error("Could not parse user from localStorage", error)
        if (!publicRoutes.includes(pathname)) {
            router.push('/login');
        }
    }
  }, [pathname, router]);

  const login = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
