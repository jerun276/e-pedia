import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { AlertCircle, Award, ArrowLeft, BadgeCheck, CheckCircle, MapPin, Send, Star, Users, Clock, Mail, Phone, MessageCircle, X } from 'lucide-react'
import { sampleMentors } from '../data/sampleData'
import { db, isFirebaseConfigured } from '../firebase/config'
import { doc, getDoc, collection, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '../firebase/AuthContext'

function Profile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { userProfile } = useAuth()
  
  const [mentor, setMentor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [targetUser, setTargetUser] = useState(null)
  const [isMessaging, setIsMessaging] = useState(false)

  useEffect(() => {
    const findMentor = async () => {
      let isMe = id === 'me' || (userProfile && id === userProfile.uid);
      let searchEmail = isMe && userProfile ? userProfile.email : null;
      let found = null;
      
      // 1. Check sampleMentors
      if (!isMe) {
        found = sampleMentors.find(m => m.id === id)
      }
      
      // 2. Check localStorage
      if (!found) {
        try {
          const stored = localStorage.getItem('epedia_custom_mentors')
          if (stored) {
            const parsed = JSON.parse(stored)
            if (isMe && searchEmail) {
              found = parsed.find(m => m.email === searchEmail)
            } else {
              found = parsed.find(m => m.id === id || m.uid === id)
            }
          }
        } catch (e) {
          console.warn('Error reading cached mentors:', e)
        }
      }
      
      // 3. Check Firestore Mentors
      if (!found && isFirebaseConfigured && db) {
        try {
          if (isMe && searchEmail) {
            const q = query(collection(db, 'mentors'), where('email', '==', searchEmail))
            const snap = await getDocs(q)
            if (!snap.empty) {
              found = { id: snap.docs[0].id, ...snap.docs[0].data() }
            }
          } else if (!isMe) {
            const docRef = doc(db, 'mentors', id)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
              found = { id: docSnap.id, ...docSnap.data() }
            } else {
              const snapshot = await getDocs(collection(db, 'mentors'))
              const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
              found = docs.find(m => m.id === id || m.uid === id)
            }
          }
        } catch (e) {
          console.warn('Firestore fetch mentor warning:', e.message)
        }
      }

      // 4. Check Firestore Users (if not a mentor)
      let foundUser = null;
      if (!found) {
        if (isMe) {
          foundUser = userProfile;
        } else if (isFirebaseConfigured && db) {
          try {
            const userDocRef = doc(db, 'users', id);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              foundUser = { uid: userDocSnap.id, ...userDocSnap.data() };
            }
          } catch (e) {
            console.warn('Firestore fetch user warning:', e.message);
          }
        }
      }
      
      setMentor(found || null)
      setTargetUser(foundUser || null)
      setLoading(false)
    }
    
    // Wait for userProfile if id is 'me'
    if (id === 'me' && userProfile === undefined) {
      return; 
    }
    
    findMentor()
  }, [id, userProfile])


  const [reviews, setReviews] = useState([])
  
  useEffect(() => {
    if (mentor) {
      const savedReviews = localStorage.getItem(`e-pedia-reviews-${mentor.id}`)
      if (savedReviews) {
        setReviews(JSON.parse(savedReviews))
      }
    }
  }, [mentor])

  const [reviewData, setReviewData] = useState({ name: '', rating: 0, comment: '' })
  const [reviewError, setReviewError] = useState('')

  if (loading) {
    return (
      <main className="profile-page">
        <div className="container" style={{ display: 'flex', justifyContent: 'center', paddingTop: 100 }}>
          <div className="spinner"></div>
        </div>
      </main>
    )
  }

  if (!mentor) {
    if (targetUser) {
      const isTeacher = targetUser.role === 'teacher' || targetUser.email?.includes('teacher')
      const isAdmin = targetUser.role === 'admin' || targetUser.email?.includes('admin')
      
      const getInitials = (name) => {
        if (!name) return 'U'
        const parts = name.trim().split(/\s+/).filter(Boolean)
        if (parts.length >= 2) {
          return (parts[0][0] + parts[1][0]).toUpperCase()
        }
        return name.slice(0, 2).toUpperCase()
      }

      return (
        <main className="profile-page" id="profile-page">
          <div className="container">
            <div className="profile-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <button
                onClick={() => navigate(-1)}
                className="btn btn-secondary btn-sm"
                style={{ marginBottom: 24 }}
              >
                <ArrowLeft size={16} /> Back
              </button>

              <div className="profile-header-card glass-card" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '48px 24px' }}>
                <div 
                  className="profile-avatar"
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: isAdmin
                      ? 'linear-gradient(135deg, #FF5252, #FF7979)'
                      : isTeacher
                      ? 'linear-gradient(135deg, var(--secondary), #00B894)'
                      : 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '3rem',
                    margin: '0 auto 24px auto',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  {getInitials(targetUser.name)}
                </div>
                <h2 style={{ fontSize: '2rem', marginBottom: 8 }}>{targetUser.name}</h2>
                <p className="profile-skill" style={{ marginBottom: 24, fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                  {targetUser.email}
                </p>
                <div className="profile-badges" style={{ justifyContent: 'center' }}>
                  <span className="mentor-badge category" style={{ fontSize: '0.9rem', padding: '6px 16px' }}>
                    {isAdmin ? 'ADMINISTRATOR' : isTeacher ? 'TEACHER' : 'LEARNER'}
                  </span>
                  {targetUser.verified && (
                    <span className="mentor-badge verified-badge" style={{ fontSize: '0.9rem', padding: '6px 16px' }}>
                      <BadgeCheck size={16} style={{ marginRight: 6 }} /> Verified
                    </span>
                  )}
                </div>
              </div>
              
              <div className="profile-details glass-card" style={{ marginTop: 24, textAlign: 'center', padding: '32px' }}>
                {id === 'me' || id === userProfile?.uid ? (
                  <>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                      You are currently signed in as a <strong style={{ color: 'var(--text-primary)' }}>{isAdmin ? 'System Administrator' : isTeacher ? 'Teacher' : 'Student'}</strong>.
                    </p>
                    {!isTeacher && !isAdmin && (
                      <div style={{ marginTop: 32 }}>
                        <p style={{ marginBottom: 16, color: 'var(--text-primary)' }}>Interested in sharing your knowledge?</p>
                        <Link to="/teach" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '1rem' }}>
                          Start Teaching
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                    This user is registered as a <strong style={{ color: 'var(--text-primary)' }}>{isAdmin ? 'System Administrator' : isTeacher ? 'Teacher' : 'Student'}</strong>.
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      )
    }

    return (
      <main className="profile-page">
        <div className="container" style={{ textAlign: 'center', paddingTop: 80 }}>
          <h2>Mentor not found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            The mentor you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/explore" className="btn btn-primary">
            <ArrowLeft size={18} /> Back to Explore
          </Link>
        </div>
      </main>
    )
  }

  const contactIcons = {
    Email: <Mail size={16} />,
    Phone: <Phone size={16} />,
    WhatsApp: <MessageCircle size={16} />,
  }

  const reviewCount = reviews.length
  const averageRating = reviewCount > 0
    ? ((mentor.rating * mentor.studentsHelped + reviews.reduce((total, review) => total + review.rating, 0)) /
      (mentor.studentsHelped + reviewCount)).toFixed(1)
    : mentor.rating
  const isTopMentor = Number(averageRating) >= 4.8 && mentor.studentsHelped >= 20


  const handleMessageMentor = async () => {
    if (!userProfile) {
      navigate('/login')
      return
    }
    
    // Can't message yourself
    if (userProfile.uid === mentor.uid || userProfile.email === mentor.email) {
      alert("You can't message yourself.")
      return
    }

    setIsMessaging(true)
    try {
      if (isFirebaseConfigured && db) {
        // Check if chat already exists by emails (most robust)
        const q = query(
          collection(db, 'chats'),
          where('participantEmails', 'array-contains', userProfile.email)
        )
        const snap = await getDocs(q)
        
        // Filter manually for the mentor's email
        let existingChatId = null
        snap.forEach(doc => {
          const data = doc.data()
          if (data.participantEmails && data.participantEmails.includes(mentor.email)) {
            existingChatId = doc.id
          } else if (data.participants && data.participants.includes(mentor.uid || mentor.id) && data.participants.includes(userProfile.uid)) {
             // Fallback for older chats without emails
             existingChatId = doc.id
          }
        })

        if (existingChatId) {
          navigate(`/messages?chatId=${existingChatId}`)
        } else {
          // Create new chat
          const mentorId = mentor.uid || mentor.id
          const newChatData = {
            participants: [userProfile.uid, mentorId],
            participantEmails: [userProfile.email, mentor.email],
            participantDetails: {
              [userProfile.uid]: {
                name: userProfile.name,
                avatar: userProfile.avatar || null
              },
              [mentorId]: {
                name: mentor.name,
                avatar: mentor.avatar || null
              }
            },
            updatedAt: serverTimestamp(),
            lastMessage: ''
          }
          const docRef = await addDoc(collection(db, 'chats'), newChatData)
          navigate(`/messages?chatId=${docRef.id}`)
        }
      } else {
        alert("Firebase is not configured for chats. Please enable it.")
      }
    } catch (error) {
      console.error("Error initiating chat:", error)
      alert("Failed to start conversation. Please try again.")
    } finally {
      setIsMessaging(false)
    }
  }

  const handleReviewSubmit = (event) => {
    event.preventDefault()
    if (!reviewData.name.trim() || reviewData.rating === 0 || reviewData.comment.trim().length < 10) {
      setReviewError('Add your name, select a rating, and write at least 10 characters.')
      return
    }
    const newReview = { ...reviewData, id: Date.now(), comment: reviewData.comment.trim() }
    const updatedReviews = [newReview, ...reviews]
    setReviews(updatedReviews)
    localStorage.setItem(`e-pedia-reviews-${mentor.id}`, JSON.stringify(updatedReviews))
    setReviewData({ name: '', rating: 0, comment: '' })
    setReviewError('')
  }

  return (
    <main className="profile-page" id="profile-page">
      <div className="container">
        <div className="profile-container">

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary btn-sm"
            style={{ marginBottom: 24 }}
            id="back-btn"
          >
            <ArrowLeft size={16} /> Back
          </button>

          {/* Profile Header */}
          <div className="profile-header-card glass-card" id="profile-header">
            <div className="profile-avatar">
              <img src={mentor.avatar} alt={mentor.name} />
            </div>
            <div className="profile-info">
              <h1>{mentor.name}</h1>
              <p className="profile-skill">{mentor.skill}</p>
              <div className="profile-badges">
                <span className="mentor-badge category">{mentor.category}</span>
                <span className="mentor-badge location">
                  <MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                  {mentor.district}
                </span>
                <span className="mentor-badge">{mentor.experienceLevel}</span>
                {mentor.verified && <span className="mentor-badge verified-badge"><BadgeCheck size={12} /> Verified</span>}
                {isTopMentor && <span className="mentor-badge top-mentor-badge"><Award size={12} /> Top Mentor</span>}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="profile-meta-grid" style={{ marginTop: 24 }}>
            <div className="profile-meta-item glass-card">
              <span className="meta-value" style={{ color: 'var(--warning)' }}>
                <Star size={18} fill="currentColor" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                {averageRating}
              </span>
              <span className="meta-label">Rating</span>
            </div>
            <div className="profile-meta-item glass-card">
              <span className="meta-value gradient-text">
                <Users size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                {mentor.studentsHelped}
              </span>
              <span className="meta-label">Students Helped</span>
            </div>
            <div className="profile-meta-item glass-card">
              <span className="meta-value" style={{ color: 'var(--secondary)' }}>
                <Clock size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                {mentor.availability.join(', ')}
              </span>
              <span className="meta-label">Availability</span>
            </div>
            <div className="profile-meta-item glass-card">
              <span className="meta-value" style={{ color: 'var(--primary-light)' }}>
                {contactIcons[mentor.contactMethod]} {mentor.contactMethod}
              </span>
              <span className="meta-label">Contact Method</span>
            </div>
          </div>

          {/* About */}
          <div className="profile-details glass-card" style={{ marginTop: 24 }}>
            <h2>About {mentor.name.split(' ')[0]}</h2>
            <p>{mentor.description}</p>
          </div>

          {/* Communication */}
          <section className="profile-details glass-card profile-communication" aria-labelledby="communication-heading">
            <div className="profile-section-heading">
              <div>
                <h2 id="communication-heading">Connect with {mentor.name.split(' ')[0]}</h2>
                <p>Ask about lessons, availability, or a learning plan.</p>
              </div>
              <button 
                className="btn btn-accent" 
                onClick={handleMessageMentor} 
                id="contact-mentor-btn"
                disabled={isMessaging}
              >
                {isMessaging ? 'Starting chat...' : (
                  <>
                    <MessageCircle size={16} />
                    Message Mentor
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Feedback */}
          <section className="profile-details glass-card profile-feedback" aria-labelledby="feedback-heading">
            <div className="profile-section-heading">
              <div>
                <h2 id="feedback-heading">Learner feedback</h2>
                <p>Share your experience to help other learners choose a mentor.</p>
              </div>
              <div className="feedback-summary">
                <Star size={18} fill="currentColor" />
                <strong>{averageRating}</strong>
                <span>{reviewCount} new review{reviewCount === 1 ? '' : 's'}</span>
              </div>
            </div>
            <form className="review-form" onSubmit={handleReviewSubmit} noValidate>
              <div className="review-form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="review-name">Your name</label>
                  <input className="form-input" id="review-name" value={reviewData.name} onChange={(event) => setReviewData({ ...reviewData, name: event.target.value })} placeholder="e.g., Nimal Silva" />
                </div>
                <div className="form-group">
                  <span className="form-label">Your rating</span>
                  <div className="star-picker" aria-label="Choose a rating">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button type="button" key={rating} className={rating <= reviewData.rating ? 'star-button selected' : 'star-button'} onClick={() => setReviewData({ ...reviewData, rating })} aria-label={`${rating} star${rating === 1 ? '' : 's'}`}>
                        <Star size={22} fill={rating <= reviewData.rating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="review-comment">Your feedback</label>
                <textarea className="form-textarea" id="review-comment" value={reviewData.comment} onChange={(event) => setReviewData({ ...reviewData, comment: event.target.value })} placeholder="What did you learn from this mentor?" />
              </div>
              {reviewError && <div className="form-error"><AlertCircle size={14} /> {reviewError}</div>}
              <button className="btn btn-primary" type="submit"><Star size={17} /> Post review</button>
            </form>
            {reviews.length > 0 && (
              <div className="review-list">
                {reviews.map(review => (
                  <article className="review-item" key={review.id}>
                    <div className="review-item-header"><strong>{review.name}</strong><span className="review-stars">{'★'.repeat(review.rating)}</span></div>
                    <p>{review.comment}</p>
                  </article>
                ))}
              </div>
            )}
          </section>


        </div>
      </div>
    </main>
  )
}

export default Profile
