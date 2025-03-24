import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';
import {
  FIREBASE_API_KEY_IOS,
  FIREBASE_API_KEY_ANDROID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID_IOS,
  FIREBASE_APP_ID_ANDROID
} from '@env';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: Platform.select({
    ios: FIREBASE_API_KEY_IOS,
    android: FIREBASE_API_KEY_ANDROID,
    default: FIREBASE_API_KEY_IOS // fallback to iOS key
  }),
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: Platform.select({
    ios: FIREBASE_APP_ID_IOS,
    android: FIREBASE_APP_ID_ANDROID,
    default: FIREBASE_APP_ID_IOS // fallback to iOS key
  })
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;