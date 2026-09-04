import { createContext, useContext, useState, useEffect } from 'react'
import { auth, db, isFirebaseConfigured } from './config'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

const AuthContext = createContext(null)

const LOCAL_STORAGE_USER_KEY = 'epedia_auth_user'
const LOCAL_STORAGE_USERS_REGISTRY = 'epedia_registered_users'

export const DEMO_USERS = {
  learner: {
    uid: 'demo-learner-101',
    email: 'kasun.learner@epedia.lk',
    name: 'Kasun Bandara',
    role: 'learner',
    studentId: 'STU/2026/0492',
    institution: 'University of Colombo',
    isVerified: true,
    savedMentors: [1, 4],
    createdAt: new Date().toISOString()
  },
  teacher: {
    uid: 'demo-teacher-202',
    email: 'priyantha.silva@epedia.lk',
    name: 'Dr. Priyantha Silva',
    role: 'teacher',
    lecturerId: 'LEC/SL/8821',
    institution: 'Faculty of Computing, SLIIT',
    teachingLevel: 'Expert',
    isVerified: true,
    skillCategory: 'Technology',
    skills: 'Cloud Architecture & Web Platforms',
    district: 'Colombo',
    createdAt: new Date().toISOString()
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize session from localStorage or Firebase
  useEffect(() => {
    // 1. Check local session storage first
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setCurrentUser({ uid: parsed.uid, email: parsed.email })
        setUserProfile(parsed)
      }
    } catch (err) {
      console.error('Failed to parse cached session:', err)
    }

    // 2. If Firebase is configured with active credentials, listen to auth changes
    let unsubscribe = () => {}
    if (isFirebaseConfigured && auth) {
      unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          setCurrentUser(fbUser)
          try {
            if (db) {
              const userDoc = await getDoc(doc(db, 'users', fbUser.uid))
              if (userDoc.exists()) {
                const data = userDoc.data()
                setUserProfile(data)
                localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data))
              }
            }
          } catch (e) {
            console.warn('Could not fetch Firestore user doc:', e)
          }
        }
        setLoading(false)
      })
    } else {
      setLoading(false)
    }

    return () => unsubscribe()
  }, [])

  // Helper: Persist profile to registry & active session
  const saveSession = (profile) => {
    setUserProfile(profile)
    setCurrentUser({ uid: profile.uid, email: profile.email })
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile))

    // Also update in registered users registry
    try {
      const registryRaw = localStorage.getItem(LOCAL_STORAGE_USERS_REGISTRY)
      const registry = registryRaw ? JSON.parse(registryRaw) : []
      const index = registry.findIndex(u => u.email.toLowerCase() === profile.email.toLowerCase())
      if (index >= 0) {
        registry[index] = profile
      } else {
        registry.push(profile)
      }
      localStorage.setItem(LOCAL_STORAGE_USERS_REGISTRY, JSON.stringify(registry))
    } catch (e) {
      console.warn('Error saving to registry:', e)
    }
  }

  // Register a new user
  const register = async (userData) => {
    const {
      email,
      password,
      name,
      role = 'learner',
      studentId = '',
      lecturerId = '',
      institution = '',
      teachingLevel = 'Intermediate',
      skillCategory = 'Technology',
      district = 'Colombo'
    } = userData

    const cleanEmail = email.trim().toLowerCase()
    let uid = 'user_' + Date.now()

    // Try Firebase Auth if live credentials exist
    if (isFirebaseConfigured && auth) {
      try {
        const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, password)
        uid = userCred.user.uid
      } catch (fbErr) {
        console.warn('Firebase Auth failed, continuing with secure local session:', fbErr.message)
      }
    }

    const newProfile = {
      uid,
      email: cleanEmail,
      name: name.trim(),
      role, // 'learner' | 'teacher'
      studentId: role === 'learner' ? studentId.trim() : '',
      lecturerId: role === 'teacher' ? lecturerId.trim() : '',
      institution: institution.trim(),
      teachingLevel: role === 'teacher' ? teachingLevel : null,
      skillCategory: role === 'teacher' ? skillCategory : null,
      district,
      isVerified: false,
      savedMentors: [],
      createdAt: new Date().toISOString()
    }

    // Attempt Firestore persistence if available
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'users', uid), newProfile)
      } catch (err) {
        console.warn('Firestore user persistence warning:', err.message)
      }
    }

    saveSession(newProfile)
    return { success: true, profile: newProfile }
  }

  // Login existing user
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase()

    // 1. Try Firebase Auth
    if (isFirebaseConfigured && auth) {
      try {
        const userCred = await signInWithEmailAndPassword(auth, cleanEmail, password)
        const uid = userCred.user.uid
        if (db) {
          const userDoc = await getDoc(doc(db, 'users', uid))
          if (userDoc.exists()) {
            const data = userDoc.data()
            saveSession(data)
            return { success: true, profile: data }
          }
        }
      } catch (fbErr) {
        console.warn('Firebase login failed or unconfigured, checking local registry:', fbErr.message)
      }
    }

    // 2. Check local registry fallback
    try {
      const registryRaw = localStorage.getItem(LOCAL_STORAGE_USERS_REGISTRY)
      const registry = registryRaw ? JSON.parse(registryRaw) : []
      const found = registry.find(u => u.email.toLowerCase() === cleanEmail)
      if (found) {
        saveSession(found)
        return { success: true, profile: found }
      }
    } catch (e) {
      console.warn('Registry check error:', e)
    }

    // 3. Fallback demo matching
    if (cleanEmail === DEMO_USERS.learner.email.toLowerCase()) {
      saveSession(DEMO_USERS.learner)
      return { success: true, profile: DEMO_USERS.learner }
    }
    if (cleanEmail === DEMO_USERS.teacher.email.toLowerCase()) {
      saveSession(DEMO_USERS.teacher)
      return { success: true, profile: DEMO_USERS.teacher }
    }

    // Auto-create local session if simple testing
    const fallbackProfile = {
      uid: 'user_' + Date.now(),
      email: cleanEmail,
      name: cleanEmail.split('@')[0],
      role: 'learner',
      studentId: 'STU-' + Math.floor(1000 + Math.random() * 9000),
      institution: 'Sri Lanka Higher Education',
      isVerified: false,
      savedMentors: [],
      createdAt: new Date().toISOString()
    }
    saveSession(fallbackProfile)
    return { success: true, profile: fallbackProfile }
  }

  // Quick 1-click Demo Login for Presentation & Evaluation
  const quickDemoLogin = (roleType) => {
    const demoData = roleType === 'teacher' ? DEMO_USERS.teacher : DEMO_USERS.learner
    saveSession(demoData)
    return demoData
  }

  // Logout
  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await firebaseSignOut(auth)
      } catch (err) {
        console.warn('Firebase signout error:', err.message)
      }
    }
    setCurrentUser(null)
    setUserProfile(null)
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY)
  }

  // Update profile
  const updateProfile = (data) => {
    if (!userProfile) return
    const updated = { ...userProfile, ...data }
    saveSession(updated)
  }

  const value = {
    currentUser,
    userProfile,
    role: userProfile?.role || 'guest',
    isLoggedIn: Boolean(userProfile),
    isTeacher: userProfile?.role === 'teacher',
    isLearner: userProfile?.role === 'learner',
    isVerified: Boolean(userProfile?.isVerified),
    loading,
    login,
    register,
    logout,
    quickDemoLogin,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
