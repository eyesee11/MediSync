# 🔥 Firestore Security Rules Setup

## 🚨 **Current Issue: Firestore Write Errors**

The console errors show Firestore WebChannel RPC 'Write' stream transport errors with "Bad Request" (400) status. This is typically caused by **Firestore Security Rules** blocking write operations.

## 📋 **Required Firestore Security Rules:**

Add these rules to your Firestore Database in the Firebase Console:

### **Go to:** 
Firebase Console → Your Project → Firestore Database → Rules

### **Replace the default rules with:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read other users' basic info (for doctors accessing patient data)
    match /users/{userId} {
      allow read: if request.auth != null;
    }
    
    // Allow access requests for document sharing
    match /accessRequests/{requestId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow test documents for debugging
    match /test/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🔧 **Steps to Fix:**

### 1. **Update Firestore Rules:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your MediSync project
3. Go to "Firestore Database" → "Rules"
4. Replace the rules with the code above
5. Click "Publish"

### 2. **Enable Firestore Authentication:**
1. Go to "Authentication" → "Sign-in method"
2. Enable "Google" sign-in method
3. Add your domain to authorized domains

### 3. **Test the Fix:**
1. Try logging in with Google again
2. Check the console for errors
3. The Firestore write errors should be resolved

## 🎯 **Expected Results After Fix:**

- ✅ No more "Bad Request" Firestore errors
- ✅ User profiles saved successfully to Firestore
- ✅ Registration IDs generated and stored
- ✅ Smooth Google authentication flow

## 🧪 **Testing Commands:**

After applying the rules, test in browser console:
```javascript
// This will test if Firestore writes are working
window.testFirestoreWrite();
```

## ⚠️ **Important Notes:**

1. **Security**: These rules allow authenticated users to access their own data and read other users' basic info (needed for doctor-patient interactions)

2. **Production**: For production, you may want to add more restrictive rules based on user roles

3. **Debugging**: The current rules include a `/test/` collection for debugging purposes

Once you apply these Firestore security rules, the write errors should be resolved and Google authentication will work smoothly!
