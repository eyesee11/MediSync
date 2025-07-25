// Firebase error handling utilities
export class FirebaseConnectionError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'FirebaseConnectionError';
  }
}

export function isBlockedByClient(error: any): boolean {
  return (
    error?.message?.includes('ERR_BLOCKED_BY_CLIENT') ||
    error?.code === 'ERR_BLOCKED_BY_CLIENT' ||
    error?.message?.includes('blocked by client') ||
    error?.message?.includes('net::ERR_BLOCKED_BY_CLIENT')
  );
}

export function isNetworkError(error: any): boolean {
  return (
    error?.message?.includes('ERR_NETWORK') ||
    error?.code === 'ERR_NETWORK' ||
    error?.message?.includes('Failed to fetch') ||
    error?.message?.includes('Network request failed')
  );
}

export function getFirebaseErrorMessage(error: any): string {
  if (isBlockedByClient(error)) {
    return 'Connection blocked by ad blocker or browser extension. Please disable ad blocker or add Firebase domains to allowlist.';
  }
  
  if (isNetworkError(error)) {
    return 'Network connection failed. Please check your internet connection.';
  }

  // Firebase-specific error codes
  switch (error?.code) {
    case 'auth/network-request-failed':
      return 'Network connection failed. Please check your internet connection.';
    case 'firestore/unavailable':
      return 'Firestore service is temporarily unavailable. Please try again later.';
    case 'firestore/permission-denied':
      return 'Permission denied. Please check your authentication.';
    case 'auth/popup-blocked':
      return 'Popup was blocked by browser. Please allow popups for this site.';
    default:
      return error?.message || 'An unknown Firebase error occurred.';
  }
}

export function handleFirebaseError(error: any, context: string = '') {
  const message = getFirebaseErrorMessage(error);
  console.error(`Firebase Error${context ? ` (${context})` : ''}:`, message);
  
  if (isBlockedByClient(error)) {
    console.warn('🚫 Ad Blocker detected! Add these domains to your allowlist:');
    console.warn('   • *.firebaseapp.com');
    console.warn('   • *.googleapis.com');
    console.warn('   • *.firestore.googleapis.com');
    console.warn('   • Or try opening in incognito mode');
  }
  
  return new FirebaseConnectionError(message, error?.code || 'unknown');
}
