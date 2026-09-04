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

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(app)

export default app
