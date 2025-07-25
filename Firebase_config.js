import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration using environment variables
// You need to create a .env.local file in your project root and add these variables:
/*
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
*/

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Only initialize Firebase if we have valid configuration
const hasValidConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                      process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'your_api_key_here' &&
                      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
                      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'your_project_id';

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

if (hasValidConfig) {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  };

  try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);

    // Initialize Firebase services
    auth = getAuth(app);
    db = getFirestore(app);

    // Configure Google Auth Provider
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    // Add additional scopes if needed
    googleProvider.addScope('email');
    googleProvider.addScope('profile');

    if (isBrowser) {
      console.log('✅ Firebase initialized successfully');
    }
  } catch (error) {
    if (isBrowser) {
      console.error('❌ Firebase initialization error:', error);
    }
  }
} else {
  if (isBrowser) {
    console.warn('⚠️ Firebase configuration missing or invalid. Please check your .env.local file.');
    console.warn('Some features may not work without proper Firebase setup.');
  }
}

// Export the services (they may be null if not configured)
export { auth, db, googleProvider };
export default app;

// Type guards for better TypeScript support
export const isFirebaseConfigured = () => auth !== null && db !== null;
export const getAuthInstance = () => auth;
export const getDBInstance = () => db;
export const getGoogleProviderInstance = () => googleProvider;