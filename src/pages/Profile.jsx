import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowLeft, CheckCircle, MapPin, Send, Star, Users, Clock, Mail, Phone, MessageCircle, X } from 'lucide-react'
import { sampleMentors } from '../data/sampleData'

function Profile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const mentor = sampleMentors.find(m => m.id === id)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [contactSent, setContactSent] = useState(false)
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' })
  const [contactErrors, setContactErrors] = useState({})
  const [reviews, setReviews] = useState(() => {
    if (!mentor) return []
    const savedReviews = localStorage.getItem(`e-pedia-reviews-${mentor.id}`)
    return savedReviews ? JSON.parse(savedReviews) : []
  })
  const [reviewData, setReviewData] = useState({ name: '', rating: 0, comment: '' })
  const [reviewError, setReviewError] = useState('')

  if (!mentor) {
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

  const openContact = () => {
    setContactSent(false)
    setContactErrors({})
    setIsContactOpen(true)
  }

  const closeContact = () => {
    setIsContactOpen(false)
    setContactSent(false)
  }

  const handleContactSubmit = (event) => {
    event.preventDefault()
    const errors = {}
    if (!contactData.name.trim()) errors.name = 'Please enter your name'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactData.email)) errors.email = 'Please enter a valid email address'
    if (contactData.message.trim().length < 10) errors.message = 'Please write at least 10 characters'
    setContactErrors(errors)
    if (Object.keys(errors).length === 0) setContactSent(true)
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
            <div className="profile-avatar">{mentor.avatar}</div>
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
              <button className="btn btn-accent" onClick={openContact} id="contact-mentor-btn">
                {contactIcons[mentor.contactMethod]}
                Send an inquiry
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

          {isContactOpen && (
            <div className="modal-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeContact()}>
              <div className="modal-content contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
                <button className="modal-close" onClick={closeContact} aria-label="Close inquiry form"><X size={20} /></button>
                {contactSent ? (
                  <>
                    <div className="modal-icon"><CheckCircle size={34} /></div>
                    <h2>Inquiry sent</h2>
                    <p>{mentor.name.split(' ')[0]} can now follow up through {mentor.contactMethod}.</p>
                    <button className="btn btn-primary" onClick={closeContact}>Done</button>
                  </>
                ) : (
                  <>
                    <h2 id="contact-modal-title">Message {mentor.name.split(' ')[0]}</h2>
                    <p>Send a short inquiry and explain what you would like to learn.</p>
                    <form onSubmit={handleContactSubmit} noValidate>
                      <div className="form-group"><label className="form-label" htmlFor="contact-name">Your name</label><input className={`form-input ${contactErrors.name ? 'error' : ''}`} id="contact-name" value={contactData.name} onChange={(event) => setContactData({ ...contactData, name: event.target.value })} />{contactErrors.name && <div className="form-error"><AlertCircle size={14} /> {contactErrors.name}</div>}</div>
                      <div className="form-group"><label className="form-label" htmlFor="contact-email">Email address</label><input type="email" className={`form-input ${contactErrors.email ? 'error' : ''}`} id="contact-email" value={contactData.email} onChange={(event) => setContactData({ ...contactData, email: event.target.value })} />{contactErrors.email && <div className="form-error"><AlertCircle size={14} /> {contactErrors.email}</div>}</div>
                      <div className="form-group"><label className="form-label" htmlFor="contact-message">Your message</label><textarea className={`form-textarea ${contactErrors.message ? 'error' : ''}`} id="contact-message" value={contactData.message} onChange={(event) => setContactData({ ...contactData, message: event.target.value })} placeholder="I would like to learn..." />{contactErrors.message && <div className="form-error"><AlertCircle size={14} /> {contactErrors.message}</div>}</div>
                      <button className="btn btn-accent form-submit" type="submit"><Send size={17} /> Send inquiry</button>
                    </form>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default Profile
