// Simple test to check Firebase auth state quickly
const { config } = require('dotenv');
config({ path: '.env.local' });

console.log('🔍 Quick Firebase Auth Diagnostic...\n');

// Check environment variables
const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

console.log('📋 Environment Variables Check:');
let allConfigured = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value && value !== 'your_api_key_here' && value !== 'your_project_id') {
    console.log(`✅ ${varName}: ${value.substring(0, 15)}...`);
  } else {
    console.log(`❌ ${varName}: MISSING or PLACEHOLDER`);
    allConfigured = false;
  }
});

if (allConfigured) {
  console.log('\n🎉 All Firebase environment variables are configured!');
  console.log('\n💡 If login page shows "Processing..." indefinitely:');
  console.log('   1. Check browser console for errors');
  console.log('   2. Clear browser cache and cookies');
  console.log('   3. Try in incognito/private mode');
  console.log('   4. Check Firebase project settings');
  console.log('\n🔗 Test the login page: http://localhost:9002/login');
} else {
  console.log('\n❌ Some Firebase configuration is missing!');
  console.log('📝 Please check your .env.local file.');
}
