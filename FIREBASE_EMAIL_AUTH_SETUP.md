# 🔧 Firebase Email Authentication Setup Guide

## ❌ Current Error:
```
FirebaseError: Firebase: Error (auth/operation-not-allowed)
```

This error occurs when **Email/Password authentication is not enabled** in Firebase Console.

## ✅ Step-by-Step Fix:

### 1. 🔗 Access Firebase Console
- Go to [Firebase Console](https://console.firebase.google.com/)
- Select your project: `medisync-hub-6dvys`

### 2. 🔑 Enable Email/Password Authentication
1. In the left sidebar, click **"Authentication"**
2. Click on the **"Sign-in method"** tab
3. You'll see a list of providers

### 3. 📧 Configure Email/Password Provider
1. Find **"Email/Password"** in the providers list
2. Click on **"Email/Password"** to configure it
3. Toggle the **"Enable"** switch to ON
4. **Important**: Enable the first option (Email/Password)
5. You can also enable "Email link (passwordless sign-in)" if desired
6. Click **"Save"**

### 4. ✅ Verify Configuration
After enabling Email/Password:
- You should see Email/Password status as "Enabled" ✅
- The provider should show a green checkmark

### 5. 🧪 Test Your Credentials
Once enabled, try signing in with your credentials:
- **Email**: Your registered email
- **Password**: Your account password

## 🚨 Additional Providers to Enable:

While you're in the Authentication settings, you might want to enable:

### Google Sign-in (if not already enabled):
1. Find **"Google"** in the providers list
2. Click to configure
3. Toggle **"Enable"** to ON
4. Add your **support email**
5. Click **"Save"**

### Anonymous Authentication (optional):
1. Find **"Anonymous"** in the providers list
2. Toggle **"Enable"** to ON
3. Click **"Save"**

## 📝 Expected Result:
After enabling Email/Password authentication:
- ✅ Email sign-in should work
- ✅ Email registration should work
- ✅ No more `auth/operation-not-allowed` errors

## 🔄 Next Steps:
1. **Enable Email/Password** in Firebase Console
2. **Refresh your MediSync app**
3. **Try logging in** with your email credentials
4. **Test registration** with a new email if needed

---
*Important: Changes in Firebase Console take effect immediately, no restart required.*
