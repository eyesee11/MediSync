'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
// @ts-ignore - Firebase_config.js doesn't provide proper TypeScript types
import { auth as authImport, googleProvider as googleProviderImport, db as dbImport } from './Firebase_config';
import { AadharAuthService } from './src/lib/aadhar-auth';

// Type-safe Firebase instances
// @ts-ignore
const auth = authImport as import('firebase/auth').Auth | null;
// @ts-ignore
const googleProvider = googleProviderImport as import('firebase/auth').GoogleAuthProvider | null;
// @ts-ignore
const db = dbImport as import('firebase/firestore').Firestore | null;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithAadhar: (aadharNumber: string, otp: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, displayName: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  sendAadharOTP: (aadharNumber: string) => Promise<{ success: boolean; message: string; txnId?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useFirebaseAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      throw new Error('Firebase authentication not configured');
    }

    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      
      // Save user data to Firestore
      if (db) {
        await setDoc(doc(db, 'users', result.user.uid), {
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
          authProvider: 'google',
          createdAt: new Date().toISOString(),
        }, { merge: true });
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithAadhar = async (aadharNumber: string, otp: string) => {
    try {
      setLoading(true);
      
      // Verify Aadhar OTP
      const verification = await AadharAuthService.verifyOTP(aadharNumber, otp);
      
      if (!verification.success) {
        throw new Error(verification.message);
      }

      // Create a custom user session (for demo purposes)
      // In production, you might want to create a Firebase custom token
      const userData = {
        uid: `aadhar_${aadharNumber}`,
        name: verification.data?.name || 'Aadhar User',
        email: `${aadharNumber}@aadhar.temp`,
        authProvider: 'aadhar',
        aadharNumber: aadharNumber,
        createdAt: new Date().toISOString(),
      };

      // Store in localStorage for demo (use proper session management in production)
      localStorage.setItem('aadharUser', JSON.stringify(userData));
      
      // Save to Firestore
      if (db) {
        await setDoc(doc(db, 'users', userData.uid), userData, { merge: true });
      }
      
    } catch (error) {
      console.error('Error signing in with Aadhar:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendAadharOTP = async (aadharNumber: string) => {
    return await AadharAuthService.sendOTP(aadharNumber);
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) {
      throw new Error('Firebase authentication not configured');
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, password: string, displayName: string, role: string) => {
    if (!auth) {
      throw new Error('Firebase authentication not configured');
    }

    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile
      await updateProfile(result.user, { displayName });
      
      // Save additional user data to Firestore
      if (db) {
        await setDoc(doc(db, 'users', result.user.uid), {
          name: displayName,
          email: email,
          role: role,
          authProvider: 'email',
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error registering with email:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
      localStorage.removeItem('aadharUser'); // Clear Aadhar session
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithAadhar,
    signInWithEmail,
    registerWithEmail,
    logout,
    sendAadharOTP,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}