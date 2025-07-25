const { config } = require('dotenv');
config({ path: '.env.local' });

// Comprehensive Google Sign-in Debug Tool
async function debugGoogleSignin() {
  console.log('🔍 Google Sign-in Debug Analysis...\n');
  
  const requiredVars = {
    'NEXT_PUBLIC_FIREBASE_API_KEY': process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID': process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    'NEXT_PUBLIC_FIREBASE_APP_ID': process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
  
  console.log('📋 Firebase Configuration Check:');
  let configValid = true;
  
  Object.entries(requiredVars).forEach(([key, value]) => {
    if (value && value !== 'your_api_key_here') {
      console.log(`✅ ${key}: ${value.substring(0, 15)}...`);
    } else {
      console.log(`❌ ${key}: MISSING or PLACEHOLDER`);
      configValid = false;
    }
  });
  
  if (!configValid) {
    console.log('\n❌ Firebase configuration is incomplete!');
    return;
  }
  
  console.log('\n🔧 Common Google Sign-in Issues & Solutions:');
  
  console.log('\n1. 🚨 REDIRECT_URI_MISMATCH Error:');
  console.log('   Problem: OAuth redirect URI not authorized');
  console.log('   Solution: Add these URIs to Google Cloud Console:');
  console.log('   - http://localhost:9002');
  console.log('   - https://medisync-hub-6dvys.firebaseapp.com');
  console.log('   - https://medisync-hub-6dvys.web.app');
  
  console.log('\n2. 🚨 AUTH/POPUP-BLOCKED Error:');
  console.log('   Problem: Browser blocking popup');
  console.log('   Solution: Allow popups for localhost:9002');
  
  console.log('\n3. 🚨 AUTH/CANCELLED-POPUP-REQUEST Error:');
  console.log('   Problem: User closed popup or multiple requests');
  console.log('   Solution: Wait and try again');
  
  console.log('\n4. 🚨 AUTH/UNAUTHORIZED-DOMAIN Error:');
  console.log('   Problem: Domain not authorized in Firebase');
  console.log('   Solution: Add domains in Firebase Console:');
  console.log('   - Authentication → Settings → Authorized domains');
  console.log('   - Add: localhost');
  
  console.log('\n5. 🚨 No Response/Hangs:');
  console.log('   Problem: Google provider not properly configured');
  console.log('   Solution: Check Firebase Console → Authentication → Sign-in method');
  console.log('   - Ensure Google is enabled');
  console.log('   - Check Web SDK configuration');
  
  console.log('\n🧪 Testing Steps:');
  console.log('1. Open browser console (F12)');
  console.log('2. Go to http://localhost:9002/login');
  console.log('3. Click "Continue with Google"');
  console.log('4. Check console for errors');
  console.log('5. Report the exact error message');
  
  console.log('\n📱 Manual Test Commands (run in browser console):');
  console.log(`
// Test Firebase initialization
console.log('Firebase Auth:', typeof window !== 'undefined' && window.firebase?.auth);

// Test Google provider
console.log('Google Provider available:', typeof GoogleAuthProvider !== 'undefined');

// Check for popup blockers
window.open('about:blank', '_blank');
  `);
  
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  console.log(`\n🔗 Useful Links:`);
  console.log(`Firebase Console: https://console.firebase.google.com/project/${projectId}/authentication/providers`);
  console.log(`Google Cloud Console: https://console.cloud.google.com/apis/credentials?project=${projectId}`);
  console.log(`Test App: http://localhost:9002/login`);
}

debugGoogleSignin();
