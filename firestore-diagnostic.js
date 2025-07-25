// Firebase Firestore Diagnostic Script
// Run this to test Firestore write operations

import { auth, db } from './Firebase_config.js';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

export async function testFirestoreWrite() {
  console.log('🔍 Testing Firestore Write Operations...');
  
  if (!db) {
    console.error('❌ Firestore not initialized');
    return false;
  }

  if (!auth?.currentUser) {
    console.error('❌ User not authenticated');
    return false;
  }

  try {
    // Test simple document write
    console.log('📝 Testing simple document write...');
    
    const testData = {
      testField: 'test value',
      timestamp: Timestamp.fromDate(new Date()),
      role: 'patient',
      verified: true,
    };

    const testDocRef = doc(db, 'test', 'diagnostic-test');
    await setDoc(testDocRef, testData);
    
    console.log('✅ Simple write successful');
    
    // Test user document write
    console.log('📝 Testing user document write...');
    
    const userData = {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email || '',
      displayName: auth.currentUser.displayName || 'Test User',
      role: 'patient',
      registrationId: 'P-MS-999',
      verified: true,
      createdAt: Timestamp.fromDate(new Date()),
      lastLogin: Timestamp.fromDate(new Date()),
    };

    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    await setDoc(userDocRef, userData);
    
    console.log('✅ User document write successful');
    return true;
    
  } catch (error) {
    console.error('❌ Firestore write failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    return false;
  }
}

// Call this from the browser console after authentication
if (typeof window !== 'undefined') {
  window.testFirestoreWrite = testFirestoreWrite;
  console.log('🔧 Diagnostic function available: window.testFirestoreWrite()');
}
