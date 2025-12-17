import { ref, computed, readonly } from 'vue';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  OAuthProvider,
  type User,
  type AuthError,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config';
import type { AuthUser } from '../types';

// Global auth state
const currentUser = ref<AuthUser | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Auth providers
const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');

// Configure Microsoft provider for common tenant (works with any Microsoft account)
microsoftProvider.setCustomParameters({
  tenant: 'common',
});

// Convert Firebase user to AuthUser
function mapFirebaseUser(user: User | null): AuthUser | null {
  if (!user) return null;

  // Determine the provider
  const providerId = user.providerData[0]?.providerId || 'unknown';
  let provider: 'google' | 'microsoft' | 'unknown' = 'unknown';
  if (providerId === 'google.com') {
    provider = 'google';
  } else if (providerId === 'microsoft.com') {
    provider = 'microsoft';
  }

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    provider,
  };
}

// Initialize auth state listener
let unsubscribe: (() => void) | null = null;

function initAuthListener() {
  if (!auth || unsubscribe) return;

  unsubscribe = onAuthStateChanged(auth, (user) => {
    currentUser.value = mapFirebaseUser(user);
    isLoading.value = false;
  }, (authError) => {
    console.error('Auth state change error:', authError);
    isLoading.value = false;
    error.value = authError.message;
  });
}

export function useAuth() {
  // Check if Firebase is configured
  const isConfigured = computed(() => isFirebaseConfigured());

  // Computed properties
  const isAuthenticated = computed(() => !!currentUser.value);
  const user = computed(() => currentUser.value);

  // Sign in with Google
  async function signInWithGoogle(): Promise<boolean> {
    if (!auth) {
      error.value = 'Firebase not configured';
      return false;
    }

    try {
      error.value = null;
      isLoading.value = true;
      await signInWithPopup(auth, googleProvider);
      return true;
    } catch (e) {
      const authError = e as AuthError;
      // Don't treat popup closed as an error
      if (authError.code === 'auth/popup-closed-by-user' || 
          authError.code === 'auth/cancelled-popup-request') {
        error.value = null;
      } else {
        error.value = authError.message;
        console.error('Google sign-in error:', authError);
      }
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  // Sign in with Microsoft
  async function signInWithMicrosoft(): Promise<boolean> {
    if (!auth) {
      error.value = 'Firebase not configured';
      return false;
    }

    try {
      error.value = null;
      isLoading.value = true;
      await signInWithPopup(auth, microsoftProvider);
      return true;
    } catch (e) {
      const authError = e as AuthError;
      // Don't treat popup closed as an error
      if (authError.code === 'auth/popup-closed-by-user' || 
          authError.code === 'auth/cancelled-popup-request') {
        error.value = null;
      } else {
        error.value = authError.message;
        console.error('Microsoft sign-in error:', authError);
      }
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  // Sign out
  async function logout(): Promise<boolean> {
    if (!auth) {
      error.value = 'Firebase not configured';
      return false;
    }

    try {
      error.value = null;
      await signOut(auth);
      return true;
    } catch (e) {
      const authError = e as AuthError;
      error.value = authError.message;
      console.error('Sign out error:', authError);
      return false;
    }
  }

  // Cleanup listener
  function cleanup() {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  }

  // Initialize the auth listener
  initAuthListener();

  return {
    // State
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isConfigured: readonly(isConfigured),
    // Methods
    signInWithGoogle,
    signInWithMicrosoft,
    logout,
    cleanup,
  };
}
