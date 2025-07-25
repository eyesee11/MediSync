const { config } = require('dotenv');
config({ path: '.env.local' });

// Test Firebase Authentication Methods Configuration
async function testAuthMethods() {
  console.log('🔍 Testing Firebase Authentication Methods...\n');
  
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  
  if (!projectId || !apiKey) {
    console.log('❌ Firebase configuration not found in environment variables');
    return;
  }
  
  console.log('✅ Firebase Project ID:', projectId);
  console.log('✅ Firebase API Key:', apiKey.substring(0, 10) + '...');
  
  try {
    // Test the Firebase Identity Toolkit configuration
    const configUrl = `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/config?key=${apiKey}`;
    
    console.log('\n🔄 Checking authentication providers...');
    
    const response = await fetch(configUrl);
    
    if (response.ok) {
      const config = await response.json();
      console.log('✅ Firebase project configuration retrieved successfully');
      
      // Check enabled providers
      const providers = config.signIn?.allowedProviders || [];
      
      console.log('\n📋 Authentication Providers Status:');
      console.log('   - Email/Password:', providers.includes('password') ? '✅ Enabled' : '❌ Disabled');
      console.log('   - Google Sign-in:', providers.includes('google.com') ? '✅ Enabled' : '❌ Disabled');
      console.log('   - Anonymous:', providers.includes('anonymous') ? '✅ Enabled' : '❌ Disabled');
      
      if (!providers.includes('password')) {
        console.log('\n🚨 EMAIL/PASSWORD AUTHENTICATION IS DISABLED!');
        console.log('   This is causing the auth/operation-not-allowed error');
        console.log('\n📝 To fix this:');
        console.log('   1. Go to Firebase Console → Authentication → Sign-in method');
        console.log('   2. Find "Email/Password" provider');
        console.log('   3. Click to configure and enable it');
        console.log('   4. Save the configuration');
      } else {
        console.log('\n🎉 Email/Password authentication is properly enabled!');
      }
      
      // Check other configuration
      if (config.authorizedDomains) {
        console.log('\n🌐 Authorized Domains:');
        config.authorizedDomains.forEach(domain => {
          console.log(`   - ${domain}`);
        });
      }
      
    } else {
      const errorData = await response.text();
      console.log('❌ Failed to retrieve Firebase configuration');
      console.log('Response status:', response.status);
      console.log('Response:', errorData.substring(0, 200) + '...');
    }
    
  } catch (error) {
    console.error('❌ Error testing authentication methods:', error.message);
  }
}

testAuthMethods();
