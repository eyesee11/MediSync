"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  Auth,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs, Firestore, Timestamp } from 'firebase/firestore';
// @ts-ignore - Firebase_config.js doesn't provide proper TypeScript types
import { auth as authImport, googleProvider as googleProviderImport, db as dbImport } from '../../Firebase_config';
import { handleFirebaseError, isBlockedByClient } from '@/lib/firebase-error-handler';

// Type-safe Firebase instances with proper typing
// @ts-ignore
const auth = authImport as import('firebase/auth').Auth | null;
// @ts-ignore
const googleProvider = googleProviderImport as import('firebase/auth').GoogleAuthProvider | null;
// @ts-ignore
const db = dbImport as import('firebase/firestore').Firestore | null;

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'patient' | 'doctor';
  registrationId: string; // New field for P-MS-001 or D-MS-001 format
  aadharNumber?: string;
  phoneNumber?: string;
  verified: boolean;
  createdAt: Date;
  lastLogin: Date;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<UserProfile | null>;
  signInWithAadhar: (aadharNumber: string, otp: string) => Promise<UserProfile | null>;
  signInWithEmail: (email: string, password: string) => Promise<UserProfile | null>;
  registerWithEmail: (email: string, password: string, displayName: string, role: 'patient' | 'doctor') => Promise<UserProfile | null>;
  sendAadharOTP: (aadharNumber: string) => Promise<{ success: boolean; message: string; txnId?: string }>;
  logout: () => Promise<void>;
  firebaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useFirebaseAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseConfigured, setFirebaseConfigured] = useState(false);

  // Check if Firebase is properly configured
  useEffect(() => {
    const isConfigured = auth !== null && db !== null;
    setFirebaseConfigured(isConfigured);
    
    if (!isConfigured) {
      console.warn('Firebase not configured. Authentication features will be limited.');
      setLoading(false);
      return;
    }

    console.log('🔄 Setting up Firebase auth state listener...');
    
    // Immediately set loading to false after a very short delay to show the form quickly
    const immediateTimeout = setTimeout(() => {
      console.log('⚡ Quick timeout - showing login form immediately');
      setLoading(false);
    }, 500); // 500ms timeout for immediate UI response

    const unsubscribe = onAuthStateChanged(auth as Auth, async (firebaseUser) => {
      console.log('🔄 Auth state changed:', firebaseUser ? `User signed in: ${firebaseUser.email}` : 'User signed out');
      
      clearTimeout(immediateTimeout); // Clear the immediate timeout since we got a response
      
      if (firebaseUser) {
        const userProfile = await getUserProfile(firebaseUser.uid);
        setUser(userProfile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      clearTimeout(immediateTimeout);
    };
  }, []);

  // Helper functions
  const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    if (!db) return null;
    
    try {
      console.log('📄 Fetching user profile for UID:', uid);
      const userDoc = await getDoc(doc(db as Firestore, 'users', uid));
      if (userDoc.exists()) {
        console.log('✅ User profile found in Firestore');
        const data = userDoc.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLogin: data.lastLogin?.toDate() || new Date(),
        } as UserProfile;
      }
      console.log('❌ User profile not found in Firestore');
      return null;
    } catch (error: any) {
      console.error('❌ Error fetching user profile:', error);
      
      // Handle offline errors gracefully
      if (error?.code === 'failed-precondition' || error?.message?.includes('client is offline')) {
        console.log('🌐 Client is offline, creating default profile...');
        // Return a default profile when offline
        return null; // Let the calling function handle profile creation
      }
      
      return null;
    }
  };

  const createUserProfile = async (userProfile: UserProfile): Promise<void> => {
    if (!db) throw new Error('Database not configured');
    
    try {
      console.log('📝 Creating user profile in Firestore...');
      console.log('👤 User profile data:', JSON.stringify({
        uid: userProfile.uid,
        email: userProfile.email,
        role: userProfile.role,
        registrationId: userProfile.registrationId,
        verified: userProfile.verified
      }, null, 2));
      
      // Validate required fields
      if (!userProfile.uid) {
        throw new Error('User UID is required');
      }
      if (!userProfile.role) {
        throw new Error('User role is required');
      }
      if (!userProfile.registrationId) {
        throw new Error('Registration ID is required');
      }
      
      // Convert Date objects to Firestore Timestamps and clean data
      const firestoreUserProfile = {
        uid: userProfile.uid,
        email: userProfile.email || '',
        displayName: userProfile.displayName || '',
        photoURL: userProfile.photoURL || '',
        role: userProfile.role,
        registrationId: userProfile.registrationId,
        verified: Boolean(userProfile.verified),
        createdAt: Timestamp.fromDate(userProfile.createdAt || new Date()),
        lastLogin: Timestamp.fromDate(userProfile.lastLogin || new Date()),
        // Only include optional fields if they exist
        ...(userProfile.aadharNumber && { aadharNumber: userProfile.aadharNumber }),
        ...(userProfile.phoneNumber && { phoneNumber: userProfile.phoneNumber }),
      };
      
      await setDoc(doc(db as Firestore, 'users', userProfile.uid), firestoreUserProfile);
      console.log('✅ User profile created successfully');
    } catch (error) {
      console.error('❌ Error creating user profile:', error);
      throw error;
    }
  };

  const updateLastLogin = async (uid: string): Promise<void> => {
    if (!db) return;
    
    try {
      console.log('🕒 Updating last login for user:', uid);
      await setDoc(doc(db as Firestore, 'users', uid), { 
        lastLogin: Timestamp.fromDate(new Date()) 
      }, { merge: true });
      console.log('✅ Last login updated');
    } catch (error) {
      console.error('❌ Error updating last login:', error);
    }
  };

  const getUserByAadhar = async (aadharNumber: string): Promise<UserProfile | null> => {
    if (!db) return null;
    
    try {
      const usersRef = collection(db as Firestore, 'users');
      const q = query(usersRef, where('aadharNumber', '==', aadharNumber));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const data = userDoc.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLogin: data.lastLogin?.toDate() || new Date(),
        } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user by Aadhar:', error);
      return null;
    }
  };

  // Validation helpers
  const validateAadharNumber = (aadharNumber: string): boolean => {
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(aadharNumber);
  };

  const validateOTP = (otp: string): boolean => {
    const otpRegex = /^\d{6}$/;
    return otpRegex.test(otp);
  };

  // Helper function to generate registration IDs
  const generateRegistrationId = async (role: 'patient' | 'doctor'): Promise<string> => {
    const prefix = role === 'patient' ? 'P-MS-' : 'D-MS-';
    
    if (firebaseConfigured && db) {
      try {
        // Query Firestore to get the next available ID
        const usersRef = collection(db as Firestore, 'users');
        const roleQuery = query(usersRef, where('role', '==', role));
        const snapshot = await getDocs(roleQuery);
        
        // Find the highest existing ID for this role
        let maxId = 0;
        snapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.registrationId) {
            const idNumber = parseInt(userData.registrationId.split('-')[2]);
            if (idNumber > maxId) {
              maxId = idNumber;
            }
          }
        });
        
        // Generate next ID
        const nextId = maxId + 1;
        return `${prefix}${nextId.toString().padStart(3, '0')}`;
      } catch (error) {
        console.error('Error generating registration ID from database:', error);
      }
    }
    
    // Fallback: generate a random ID if Firebase is not available
    const randomId = Math.floor(Math.random() * 999) + 1;
    return `${prefix}${randomId.toString().padStart(3, '0')}`;
  };

  // Authentication methods
  const signInWithGoogle = async (): Promise<UserProfile | null> => {
    if (!auth || !googleProvider) {
      console.error('❌ Firebase auth or Google provider not configured');
      console.log('Auth status:', !!auth);
      console.log('Google provider status:', !!googleProvider);
      throw new Error('Firebase authentication not configured');
    }

    try {
      setLoading(true);
      console.log('🔄 Starting Google sign-in...');
      console.log('🔧 Auth domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
      console.log('🔧 Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
      
      const result = await signInWithPopup(auth as Auth, googleProvider as GoogleAuthProvider);
      const firebaseUser = result.user;
      console.log('✅ Google sign-in successful for:', firebaseUser.email);
      
      // Check if user exists in Firestore
      console.log('🔍 Checking if user profile exists...');
      let userProfile = await getUserProfile(firebaseUser.uid);
      
      if (!userProfile) {
        console.log('👤 Creating new user profile...');
        // Generate registration ID for new user
        const registrationId = await generateRegistrationId('patient');
        
        // Create new user profile
        userProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || '',
          role: 'patient', // Default role
          registrationId, // Add registration ID
          verified: true, // Google users are pre-verified
          createdAt: new Date(),
          lastLogin: new Date()
        };
        
        try {
          await createUserProfile(userProfile);
          console.log('✅ New user profile created successfully');
        } catch (dbError: any) {
          console.warn('⚠️ Could not save user profile to Firestore:');
          console.warn('Error code:', dbError?.code);
          console.warn('Error message:', dbError?.message);
          console.warn('Full error:', dbError);
          
          // Check for specific Firestore errors
          if (dbError?.code === 'permission-denied') {
            console.error('🚫 PERMISSION DENIED: Check Firestore security rules');
            console.error('📖 See FIRESTORE_RULES_SETUP.md for help');
          } else if (dbError?.code === 'invalid-argument') {
            console.error('🔍 INVALID ARGUMENT: Check data format');
          } else if (dbError?.code === 'unauthenticated') {
            console.error('🔐 UNAUTHENTICATED: User not properly authenticated');
          }
          
          console.log('🔄 Continuing with in-memory profile...');
          // Continue with the profile even if we can't save to Firestore
        }
      } else {
        console.log('✅ Existing user found, updating last login...');
        // Try to update last login, but don't fail if offline
        try {
          await updateLastLogin(firebaseUser.uid);
        } catch (dbError: any) {
          console.warn('⚠️ Could not update last login (possibly offline):', dbError?.message);
          // Don't fail the sign-in process
        }
      }
      
      setUser(userProfile);
      console.log('🎉 User authentication complete!');
      return userProfile; // Return user profile for routing
    } catch (error: any) {
      console.error('❌ Google sign in error:', error);
      console.error('Error code:', error?.code);
      console.error('Error message:', error?.message);
      
      // Log specific Google Sign-in errors for debugging
      if (error?.code) {
        switch (error.code) {
          case 'auth/popup-blocked':
            console.error('🚨 Popup was blocked by browser');
            break;
          case 'auth/popup-closed-by-user':
            console.error('🚨 User closed the popup');
            break;
          case 'auth/cancelled-popup-request':
            console.error('🚨 Popup request was cancelled');
            break;
          case 'auth/unauthorized-domain':
            console.error('🚨 Domain not authorized in Firebase Console');
            break;
          case 'auth/operation-not-allowed':
            console.error('🚨 Google Sign-in not enabled in Firebase Console');
            break;
          default:
            console.error('🚨 Unknown error:', error.code);
        }
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithAadhar = async (aadharNumber: string, otp: string): Promise<UserProfile | null> => {
    try {
      setLoading(true);
      
      // Validate inputs
      if (!validateAadharNumber(aadharNumber)) {
        throw new Error('Invalid Aadhar number format');
      }
      
      if (!validateOTP(otp)) {
        throw new Error('Invalid OTP format');
      }

      // For demo purposes, create a mock user
      const registrationId = await generateRegistrationId('patient');
      
      let userProfile: UserProfile = {
        uid: `aadhar_${aadharNumber}_${Date.now()}`,
        email: '',
        displayName: `User ${aadharNumber.slice(-4)}`,
        aadharNumber,
        role: 'patient',
        registrationId, // Add registration ID
        verified: true,
        createdAt: new Date(),
        lastLogin: new Date()
      };

      if (firebaseConfigured) {
        // Check if user exists with this Aadhar
        const existingUser = await getUserByAadhar(aadharNumber);
        
        if (!existingUser) {
          await createUserProfile(userProfile);
        } else {
          await updateLastLogin(existingUser.uid);
          userProfile = existingUser;
        }
      }
      
      setUser(userProfile);
      return userProfile; // Return user profile for routing
    } catch (error) {
      console.error('Aadhar sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<UserProfile | null> => {
    if (!auth) {
      throw new Error('Firebase authentication not configured');
    }

    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth as Auth, email, password);
      const userProfile = await getUserProfile(result.user.uid);
      
      if (userProfile) {
        await updateLastLogin(result.user.uid);
        setUser(userProfile);
        return userProfile; // Return user profile for routing
      }
      return null; // Return null if no profile found
    } catch (error) {
      console.error('Email sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format display name with doctor prefix
  const formatDisplayName = (name: string, role: 'patient' | 'doctor'): string => {
    if (role === 'doctor') {
      // Check if name already starts with Dr. or Dr (case insensitive)
      if (!/^dr\.?\s/i.test(name.trim())) {
        return `Dr. ${name.trim()}`;
      }
    }
    return name.trim();
  };

  const registerWithEmail = async (
    email: string, 
    password: string, 
    displayName: string, 
    role: 'patient' | 'doctor'
  ): Promise<UserProfile | null> => {
    if (!auth) {
      throw new Error('Firebase authentication not configured');
    }

    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth as Auth, email, password);
      
      // Format display name with doctor prefix if needed
      const formattedDisplayName = formatDisplayName(displayName, role);
      
      // Update display name in Firebase Auth
      await updateProfile(result.user, { displayName: formattedDisplayName });
      
      // Generate registration ID based on role
      const registrationId = await generateRegistrationId(role);
      
      // Create user profile
      const userProfile: UserProfile = {
        uid: result.user.uid,
        email: result.user.email || '',
        displayName: formattedDisplayName,
        role,
        registrationId, // Add registration ID
        verified: false, // Email users need verification
        createdAt: new Date(),
        lastLogin: new Date()
      };
      
      await createUserProfile(userProfile);
      setUser(userProfile);
      return userProfile; // Return user profile for routing
    } catch (error) {
      console.error('Email registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendAadharOTP = async (aadharNumber: string): Promise<{ success: boolean; message: string; txnId?: string }> => {
    try {
      // Validate Aadhar number
      if (!validateAadharNumber(aadharNumber)) {
        return {
          success: false,
          message: 'Please enter a valid 12-digit Aadhar number'
        };
      }

      // Mock OTP sending (In real implementation, integrate with Aadhar API)
      const mockTxnId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        success: true,
        message: 'OTP sent successfully to your registered mobile number',
        txnId: mockTxnId
      };
    } catch (error) {
      console.error('Error sending Aadhar OTP:', error);
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.'
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('🔓 Signing out user...');
      if (auth) {
        await signOut(auth as Auth);
      }
      setUser(null);
      console.log('✅ User signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signInWithAadhar,
    signInWithEmail,
    registerWithEmail,
    sendAadharOTP,
    logout,
    firebaseConfigured,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
