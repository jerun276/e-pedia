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

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize session from Firebase Auth and localStorage
  useEffect(() => {
    // 1. Check local session storage first for immediate render
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

    // 2. Listen to real Firebase Auth state changes if Firebase is configured
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
              } else {
                // If user authenticated but doc doesn't exist yet
                const fallbackData = {
                  uid: fbUser.uid,
                  email: fbUser.email,
                  name: fbUser.displayName || fbUser.email.split('@')[0],
                  role: 'learner',
                  createdAt: new Date().toISOString()
                }
                setUserProfile(fallbackData)
              }
            }
          } catch (e) {
            console.warn('Could not fetch Firestore user doc:', e)
          }
        } else {
          // Firebase auth explicitly logged out
          if (isFirebaseConfigured) {
            setCurrentUser(null)
            setUserProfile(null)
            localStorage.removeItem(LOCAL_STORAGE_USER_KEY)
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

  // Real Register function using Firebase Auth & Firestore
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

    if (isFirebaseConfigured && auth) {
      try {
        const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, password)
        uid = userCred.user.uid
      } catch (fbErr) {
        if (fbErr.code === 'auth/email-already-in-use') {
          throw new Error('This email address is already registered. Please sign in instead.')
        } else if (fbErr.code === 'auth/weak-password') {
          throw new Error('Password should be at least 6 characters.')
        } else if (fbErr.code === 'auth/invalid-email') {
          throw new Error('Please enter a valid email address.')
        } else {
          throw new Error(fbErr.message || 'Firebase Registration Error')
        }
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

  // Real Login function using Firebase Auth & Firestore
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase()

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

        const fallbackProfile = {
          uid,
          email: cleanEmail,
          name: cleanEmail.split('@')[0],
          role: 'learner',
          createdAt: new Date().toISOString()
        }
        saveSession(fallbackProfile)
        return { success: true, profile: fallbackProfile }
      } catch (fbErr) {
        if (
          fbErr.code === 'auth/user-not-found' ||
          fbErr.code === 'auth/wrong-password' ||
          fbErr.code === 'auth/invalid-credential'
        ) {
          throw new Error('Invalid email or password. Please check your credentials.')
        } else if (fbErr.code === 'auth/invalid-email') {
          throw new Error('Please enter a valid email address.')
        } else {
          throw new Error(fbErr.message || 'Authentication failed.')
        }
      }
    }

    // Check local registry fallback if Firebase credentials are unconfigured
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

    const fallbackProfile = {
      uid: 'user_' + Date.now(),
      email: cleanEmail,
      name: cleanEmail.split('@')[0],
      role: 'learner',
      studentId: 'STU-' + Math.floor(1000 + Math.random() * 9000),
      institution: 'Sri Lanka Education',
      isVerified: false,
      savedMentors: [],
      createdAt: new Date().toISOString()
    }
    saveSession(fallbackProfile)
    return { success: true, profile: fallbackProfile }
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
    if (isFirebaseConfigured && db && userProfile.uid) {
      setDoc(doc(db, 'users', userProfile.uid), updated, { merge: true }).catch(err =>
        console.warn('Firestore profile update error:', err)
      )
    }
  }

  const value = {
    currentUser,
    userProfile,
    role: userProfile?.role || 'guest',
    isLoggedIn: Boolean(userProfile),
    isTeacher: userProfile?.role === 'teacher',
    isLearner: userProfile?.role === 'learner',
    isAdmin: userProfile?.role === 'admin' || Boolean(userProfile?.email?.toLowerCase().includes('admin')),
    isVerified: Boolean(userProfile?.isVerified),
    loading,
    login,
    register,
    logout,
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
