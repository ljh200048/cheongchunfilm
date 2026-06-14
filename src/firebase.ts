/// <reference types="vite/client" />
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Standard Firebase configuration for cheongchunfilm-site (Web)
// Priority is given to VITE_ environment variables if provided by AI Studio setting secrets,
// otherwise falls back to the production site default properties (cheongchunfilm-site).
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBixc-qwtayr86ozUjVwnN_dGgTM4VIEdg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cheongchunfilm-site.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cheongchunfilm-site",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cheongchunfilm-site.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1095212470598",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1095212470598:web:8fefe44ad11f9da1d1d547",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize and export services
export const db = getFirestore(app, "ai-studio-88e10f5b-b486-4ecc-8519-0c9de9759a1a");
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
