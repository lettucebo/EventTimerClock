# OAuth Authentication Setup Guide

This document explains how to set up Google and Microsoft OAuth authentication for the Event Timer Clock application using Firebase Authentication.

## Prerequisites

- A Google account
- A Microsoft account (for Microsoft authentication)
- Basic understanding of OAuth 2.0

## Overview

The application uses Firebase Authentication to handle OAuth 2.0 authentication with both Google and Microsoft identity providers. Firebase simplifies the OAuth flow and provides secure token management.

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "EventTimerClock")
4. (Optional) Enable Google Analytics
5. Click **"Create project"**

## Step 2: Enable Authentication Providers

### Enable Google Sign-In

1. In the Firebase Console, go to **Build** → **Authentication**
2. Click the **"Sign-in method"** tab
3. Click on **"Google"** in the providers list
4. Toggle **Enable** to ON
5. Select a support email address
6. Click **"Save"**

### Enable Microsoft Sign-In

1. In the **Sign-in method** tab, click **"Add new provider"**
2. Select **"Microsoft"** from the list
3. You'll need to provide:
   - **Application (client) ID**
   - **Application (client) secret**

   To get these credentials, follow the Microsoft setup below.

#### Create Microsoft Azure AD Application

1. Go to the [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **"New registration"**
4. Fill in the application details:
   - **Name**: EventTimerClock
   - **Supported account types**: Select "Accounts in any organizational directory and personal Microsoft accounts"
   - **Redirect URI**: 
     - Type: Web
     - URL: `https://<your-firebase-project-id>.firebaseapp.com/__/auth/handler`
5. Click **"Register"**

6. After registration, note the **Application (client) ID** on the overview page

7. Go to **Certificates & secrets** → **Client secrets** → **New client secret**
   - Add a description
   - Select an expiration period
   - Click **"Add"**
   - **Copy the secret value immediately** (it won't be shown again)

8. Return to Firebase Console and paste the Application ID and Client Secret
9. Click **"Save"**

## Step 3: Register Your Web Application

1. In Firebase Console, go to **Project Overview** → **Project settings** (gear icon)
2. Scroll down to **"Your apps"** section
3. Click the web icon (`</>`) to add a web app
4. Register the app with a nickname (e.g., "EventTimerClock Web")
5. (Optional) Enable Firebase Hosting
6. Click **"Register app"**
7. Copy the Firebase configuration object - you'll need these values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 4: Configure Environment Variables

### For Local Development

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Firebase configuration:
   ```bash
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### For GitHub Actions Deployment

1. Go to your GitHub repository **Settings** → **Secrets and variables** → **Actions**
2. Add the following repository secrets:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

3. The deployment workflow will automatically use these secrets during the build process.

## Step 5: Configure Authorized Domains

1. In Firebase Console, go to **Authentication** → **Settings** → **Authorized domains**
2. Add your deployment domains:
   - `localhost` (for development)
   - `your-github-username.github.io` (for GitHub Pages)
   - Any custom domains you're using

## Security Considerations

### What's Safe to Expose

- **Firebase API Key**: This is safe to expose in client-side code. Firebase uses security rules and authorized domains to restrict access.
- **Firebase Project ID**: This is public information.

### What Should NOT Be Exposed

- **Microsoft Client Secret**: This is handled by Firebase on the server-side and should never be in your client code.
- **Any private keys or service account credentials**

### Best Practices

1. **Use Firebase Security Rules**: Configure Firestore/Realtime Database rules to protect user data
2. **Enable authorized domains**: Only allow authentication from trusted domains
3. **Monitor usage**: Use Firebase's usage dashboard to detect suspicious activity
4. **Rotate secrets**: Periodically rotate your Microsoft client secret

## Troubleshooting

### "Firebase not configured" Message

If you see this message, the environment variables are not properly set. Ensure:
- `.env.local` exists with correct values (for development)
- GitHub Secrets are configured (for deployment)
- The app was rebuilt after adding environment variables

### "popup-closed-by-user" Error

This is not an error - it means the user closed the login popup. The app handles this gracefully.

### "auth/unauthorized-domain" Error

Add your domain to the authorized domains list in Firebase Console.

### Microsoft Login Issues

1. Verify the redirect URI in Azure AD matches exactly:
   `https://YOUR_PROJECT_ID.firebaseapp.com/__/auth/handler`
2. Ensure the client secret hasn't expired
3. Check that "Accounts in any organizational directory and personal Microsoft accounts" is selected

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   User Browser  │────▶│ Firebase Auth    │────▶│ Google/Microsoft│
│                 │◀────│ (popup flow)     │◀────│ OAuth Servers   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

1. User clicks "Sign in with Google/Microsoft"
2. Firebase opens a popup to the OAuth provider
3. User authenticates with Google/Microsoft
4. Provider returns tokens to Firebase
5. Firebase provides user info to the application

## References

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Google Identity Platform](https://developers.google.com/identity)
- [Microsoft Identity Platform](https://learn.microsoft.com/en-us/azure/active-directory/develop/)
- [OAuth 2.0 Specification](https://oauth.net/2/)
