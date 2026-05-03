/**
 * @file firebase.ts
 * @description Initializes Firebase services (Firestore, Auth, Analytics).
 * Provides a central point for Firebase configuration and service instances.
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

/**
 * Firebase configuration object retrieved from environment variables.
 */
const firebaseConfiguration = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

/**
 * Flag indicating if Firebase has been properly configured with non-placeholder values.
 */
export const isFirebaseConfigured: boolean =
  !!firebaseConfiguration.apiKey &&
  !firebaseConfiguration.apiKey.includes('YOUR_');

let firebaseAppInstance: FirebaseApp | null = null;
let firestoreDatabase: Firestore | null = null;
let firebaseAuthInstance: Auth | null = null;
let firebaseAnalyticsInstance: Analytics | null = null;

if (isFirebaseConfigured) {
  // Avoid initializing multiple times during Hot Module Replacement (HMR)
  firebaseAppInstance = getApps().length === 0 
    ? initializeApp(firebaseConfiguration) 
    : getApps()[0];
    
  firestoreDatabase = getFirestore(firebaseAppInstance);
  firebaseAuthInstance = getAuth(firebaseAppInstance);

  // Analytics is optional and only works in browser environments with valid config
  isSupported()
    .then((isSupportedResult) => {
      if (isSupportedResult && firebaseAppInstance) {
        firebaseAnalyticsInstance = getAnalytics(firebaseAppInstance);
      }
    })
    .catch((error) => {
      // Silently fail if analytics is blocked or not supported
      console.warn('Firebase Analytics could not be initialized:', error);
    });
}

export { 
  firebaseAppInstance as firebaseApp, 
  firestoreDatabase as firestore, 
  firebaseAuthInstance as firebaseAuth, 
  firebaseAnalyticsInstance as firebaseAnalytics 
};


