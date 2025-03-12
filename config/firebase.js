// config/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { 
  FIREBASE_API_KEY, 
  FIREBASE_AUTH_DOMAIN, 
  FIREBASE_PROJECT_ID, 
  FIREBASE_STORAGE_BUCKET, 
  FIREBASE_MESSAGING_SENDER_ID, 
  FIREBASE_APP_ID_IOS, 
  FIREBASE_APP_ID_ANDROID, 
  FIREBASE_MEASUREMENT_ID 
} from '@env';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: Platform.OS === 'ios' ? FIREBASE_APP_ID_IOS : FIREBASE_APP_ID_ANDROID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

let auth;

console.log("Starting Firebase initialization for", Platform.OS);

try {
  // Check if Firebase app is already initialized
  let app;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp(); // Use existing app if already initialized
  }
  console.log("Firebase app initialized successfully:", app.name);

  // Initialize Auth with persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
  console.log("Firebase auth initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", {
    message: error.message,
    code: error.code,
    stack: error.stack,
  });
  throw error;
}

export { auth };