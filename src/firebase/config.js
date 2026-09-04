// Firebase configuration for E-Pedia
// ROLE_3 (Functional Implementation) manages this file
//
// TODO: Replace the placeholder values below with your actual Firebase config.
// Steps:
// 1. Go to https://console.firebase.google.com/
// 2. Create a project called "E-Pedia" (or similar)
// 3. Add a Web App
// 4. Enable Firestore Database (in test mode for hackathon)
// 5. Copy the config values here

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "YOUR_API_KEY" && 
  !firebaseConfig.apiKey.includes("YOUR_")
)

// Initialize Firebase
let app
let db
let auth

try {
  app = initializeApp(firebaseConfig)
  db = getFirestore(app)
  auth = getAuth(app)
} catch (err) {
  console.warn("Firebase initialization warning (using local fallback engine):", err.message)
}

export { app, db, auth }
export default app

