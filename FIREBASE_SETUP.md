# Firebase Setup Guide for ViScan

## Prerequisites

- Firebase account (free)
- Google Cloud Console access
- Apple Developer account (for Apple Sign-In)

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `viscan-app`
4. Enable Google Analytics (recommended)
5. Click "Create Project"

## Step 2: Add Web App

1. In Firebase Console, click the Web icon (</>)
2. Register app with nickname: `ViScan Web`
3. Check "Also set up Firebase Hosting"
4. Copy the Firebase configuration object

## Step 3: Configure Authentication

### Enable Google Sign-In

1. Go to Authentication → Sign-in method
2. Click "Google"
3. Enable the provider
4. Add support email: `msmbm2003@gmail.com`
5. Save

### Enable Apple Sign-In

1. Go to Authentication → Sign-in method
2. Click "Apple"
3. Enable the provider
4. You'll need:
   - **Services ID**: Create in [Apple Developer](https://developer.apple.com/account/resources/identifiers/list/serviceId)
   - **Team ID**: Found in Apple Developer account
   - **Key ID**: Create a new key in Apple Developer
   - **Private Key**: Download from Apple Developer (p8 file)

#### Apple Developer Setup:

1. Go to [Apple Developer](https://developer.apple.com/account/)
2. Sign in with: `msmbm2003@gmail.com`
3. Go to Certificates, Identifiers & Profiles

**Create App ID:**

1. Click Identifiers → App IDs
2. Register new App ID
3. Description: `ViScan App`
4. Bundle ID: `com.viscan.app` (explicit)
5. Enable "Sign In with Apple"
6. Save

**Create Services ID:**

1. Click Identifiers → Services IDs
2. Register new Services ID
3. Description: `ViScan Web`
4. Identifier: `com.viscan.web`
5. Enable "Sign In with Apple"
6. Configure:
   - Primary App ID: Select your App ID
   - Domains: Add your domain (e.g., `viscan.app`)
   - Return URLs: `https://viscan-app.firebaseapp.com/__/auth/handler`
7. Save

**Create Key:**

1. Go to Keys
2. Register a new key
3. Key Name: `ViScan Apple Sign In Key`
4. Enable "Sign In with Apple"
5. Configure: Select your Primary App ID
6. Save and download the .p8 file (keep it safe!)
7. Note the Key ID

**Get Team ID:**

1. In Apple Developer, go to Membership
2. Copy your Team ID

## Step 4: Add Firebase Config to Project

Create `.env` file in project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=viscan-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=viscan-app
VITE_FIREBASE_STORAGE_BUCKET=viscan-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Apple Sign-In (Backend)
APPLE_TEAM_ID=your_team_id
APPLE_KEY_ID=your_key_id
APPLE_SERVICES_ID=com.viscan.web
APPLE_PRIVATE_KEY_PATH=./apple-key.p8
```

## Step 5: Install Firebase SDK

```bash
pnpm add firebase
```

## Step 6: Initialize Firebase in App

Create `client/src/lib/firebase.ts`:

```typescript
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider("apple.com");

// Configure providers
googleProvider.setCustomParameters({
  prompt: "select_account",
});

appleProvider.addScope("email");
appleProvider.addScope("name");
```

## Step 7: Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Build
npm run build

# Deploy
firebase deploy
```

## Step 8: Configure Custom Domain (Optional)

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter your domain (e.g., `viscan.app`)
4. Follow DNS configuration instructions
5. Wait for SSL certificate (can take 24 hours)

## Step 9: Enable Firestore Database

1. Go to Firestore Database
2. Click "Create database"
3. Start in production mode
4. Choose location (e.g., us-central1)
5. Create collections:
   - `users`
   - `analyses`
   - `recommendations`

## Step 10: Set Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Analyses collection
    match /analyses/{analysisId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }

    // Recommendations collection
    match /recommendations/{recId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## Step 11: Enable Cloud Storage

1. Go to Storage
2. Click "Get started"
3. Start in production mode
4. Choose location

Set Storage Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Testing

1. Test Google Sign-In on localhost
2. Test Apple Sign-In (requires HTTPS domain)
3. Test data storage in Firestore
4. Test file uploads to Storage

## Production Checklist

- [ ] Firebase project created
- [ ] Web app registered
- [ ] Google Sign-In enabled
- [ ] Apple Sign-In configured
- [ ] Environment variables set
- [ ] Firebase SDK installed
- [ ] Firestore database created
- [ ] Security rules configured
- [ ] Storage enabled
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] App deployed to Firebase Hosting

## Support

- Firebase Documentation: https://firebase.google.com/docs
- Apple Sign-In Guide: https://firebase.google.com/docs/auth/ios/apple
- Google Sign-In Guide: https://firebase.google.com/docs/auth/web/google-signin

## Account Information

- **Apple Developer Account**: msmbm2003@gmail.com
- **Firebase Project**: viscan-app
- **Support Email**: msmbm2003@gmail.com
