// Firebase Seeding Utility for E-Pedia
// Populates Firestore 'mentors' collection with initial 18 Sri Lankan mentor profiles

import { db, isFirebaseConfigured } from './config'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { sampleMentors } from '../data/sampleData'

/**
 * Seed Firestore with initial sample mentors if collection is empty
 */
export async function seedInitialMentors() {
  if (!isFirebaseConfigured || !db) {
    console.log('Firebase not configured yet — skipping Firestore database seed.')
    return { success: false, reason: 'Firebase credentials missing or placeholder in .env' }
  }

  try {
    const mentorsRef = collection(db, 'mentors')
    const snapshot = await getDocs(mentorsRef)

    if (!snapshot.empty) {
      console.log(`Firestore 'mentors' collection already contains ${snapshot.size} documents.`)
      return { success: true, seeded: false, count: snapshot.size }
    }

    console.log('Seeding initial 18 Sri Lankan mentor profiles to Firestore...')
    let addedCount = 0

    for (const mentor of sampleMentors) {
      const mentorData = {
        name: mentor.name || 'Sri Lankan Mentor',
        email: mentor.email || `${mentor.name.toLowerCase().replace(/[^a-z]/g, '')}@epedia.lk`,
        skill: mentor.skill || 'General Knowledge',
        category: mentor.category || 'Technology',
        experienceLevel: mentor.experienceLevel || 'Expert',
        district: mentor.district || 'Colombo',
        description: mentor.description || 'Experienced mentor ready to teach eager Sri Lankan learners.',
        rating: mentor.rating || 4.9,
        studentsCount: mentor.studentsHelped || mentor.studentsCount || 12,
        availability: mentor.availability || ['Weekdays', 'Weekends'],
        contactMethod: mentor.contactMethod || 'Email',
        isVerified: Boolean(mentor.isVerified !== undefined ? mentor.isVerified : true),
        avatar: mentor.avatar || (mentor.name ? mentor.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'EP'),
        createdAt: mentor.createdAt || new Date().toISOString()
      }


      // Remove any leftover undefined properties to guarantee Firestore compatibility
      Object.keys(mentorData).forEach(key => {
        if (mentorData[key] === undefined) {
          delete mentorData[key]
        }
      })

      await addDoc(mentorsRef, mentorData)
      addedCount++
    }

    console.log(`Successfully seeded ${addedCount} mentors to Firestore!`)
    return { success: true, seeded: true, count: addedCount }
  } catch (error) {
    console.error('Error seeding Firestore database:', error)
    return { success: false, error: error.message }
  }
}
