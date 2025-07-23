import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './config';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'patient' | 'doctor';
  aadharNumber?: string;
  phoneNumber?: string;
  verified: boolean;
  createdAt: Date;
  lastLogin: Date;
}

class FirebaseAuthService {
  // Google Sign In
  async signInWithGoogle(): Promise<UserProfile | null> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userDoc = await this.getUserProfile(user.uid);
      
      if (!userDoc) {
        // Create new user profile
        const newUserProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          role: 'patient', // Default role
          verified: true, // Google users are pre-verified
          createdAt: new Date(),
          lastLogin: new Date()
        };
        
        await this.createUserProfile(newUserProfile);
        return newUserProfile;
      } else {
        // Update last login
        await this.updateLastLogin(user.uid);
        return userDoc;
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  }

  // Aadhar Card Authentication (Mock Implementation)
  async signInWithAadhar(aadharNumber: string, otp: string): Promise<UserProfile | null> {
    try {
      // Mock Aadhar verification
      const isValidAadhar = this.validateAadharNumber(aadharNumber);
      const isValidOTP = this.validateOTP(otp);
      
      if (!isValidAadhar || !isValidOTP) {
        throw new Error('Invalid Aadhar number or OTP');
      }

      // Check if user exists with this Aadhar
      const existingUser = await this.getUserByAadhar(aadharNumber);
      
      if (existingUser) {
        await this.updateLastLogin(existingUser.uid);
        return existingUser;
      } else {
        // Create anonymous user account for Aadhar login
        const anonymousUser = await this.createAadharUser(aadharNumber);
        return anonymousUser;
      }
    } catch (error) {
      console.error('Aadhar sign in error:', error);
      throw error;
    }
  }

  // Email/Password Sign In
  async signInWithEmail(email: string, password: string): Promise<UserProfile | null> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userProfile = await this.getUserProfile(result.user.uid);
      
      if (userProfile) {
        await this.updateLastLogin(result.user.uid);
      }
      
      return userProfile;
    } catch (error) {
      console.error('Email sign in error:', error);
      throw error;
    }
  }

  // Email/Password Registration
  async registerWithEmail(
    email: string, 
    password: string, 
    displayName: string, 
    role: 'patient' | 'doctor'
  ): Promise<UserProfile | null> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      await updateProfile(result.user, { displayName });
      
      // Create user profile
      const userProfile: UserProfile = {
        uid: result.user.uid,
        email: result.user.email || '',
        displayName,
        role,
        verified: false,
        createdAt: new Date(),
        lastLogin: new Date()
      };
      
      await this.createUserProfile(userProfile);
      return userProfile;
    } catch (error) {
      console.error('Email registration error:', error);
      throw error;
    }
  }

  // Sign Out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Auth State Observer
  onAuthStateChange(callback: (user: UserProfile | null) => void): () => void {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userProfile = await this.getUserProfile(user.uid);
        callback(userProfile);
      } else {
        callback(null);
      }
    });
  }

  // Firestore Operations
  private async createUserProfile(userProfile: UserProfile): Promise<void> {
    await setDoc(doc(db, 'users', userProfile.uid), userProfile);
  }

  private async getUserProfile(uid: string): Promise<UserProfile | null> {
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() ? userDoc.data() as UserProfile : null;
  }

  private async updateLastLogin(uid: string): Promise<void> {
    await setDoc(doc(db, 'users', uid), { lastLogin: new Date() }, { merge: true });
  }

  private async getUserByAadhar(aadharNumber: string): Promise<UserProfile | null> {
    // This would typically query Firestore for existing Aadhar users
    // Mock implementation for now
    return null;
  }

  private async createAadharUser(aadharNumber: string): Promise<UserProfile> {
    // Create a user profile for Aadhar authentication
    const userProfile: UserProfile = {
      uid: `aadhar_${aadharNumber}`,
      email: '',
      displayName: `User ${aadharNumber.slice(-4)}`,
      aadharNumber,
      role: 'patient',
      verified: true,
      createdAt: new Date(),
      lastLogin: new Date()
    };
    
    await this.createUserProfile(userProfile);
    return userProfile;
  }

  // Validation helpers
  private validateAadharNumber(aadharNumber: string): boolean {
    // Aadhar number validation (12 digits)
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(aadharNumber);
  }

  private validateOTP(otp: string): boolean {
    // OTP validation (6 digits)
    const otpRegex = /^\d{6}$/;
    return otpRegex.test(otp);
  }
}

export const firebaseAuth = new FirebaseAuthService();