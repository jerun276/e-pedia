import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AlertCircle, CheckCircle, Send, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react'
import { categories, districts, experienceLevels } from '../data/sampleData'
import { useAuth } from '../firebase/AuthContext'
import { db, isFirebaseConfigured } from '../firebase/config'
import { collection, addDoc } from 'firebase/firestore'

function TeachForm() {
  const navigate = useNavigate()
  const { userProfile, isTeacher, isVerified } = useAuth()
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skill: '',
    category: '',
    experienceLevel: '',
    district: '',
    description: '',
    availability: [],
    contactMethod: '',
  })

  // Auto pre-fill if authenticated as a teacher or user
  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || userProfile.name || '',
        email: prev.email || userProfile.email || '',
        experienceLevel: prev.experienceLevel || userProfile.teachingLevel || '',
        category: prev.category || userProfile.skillCategory || '',
        district: prev.district || userProfile.district || ''
      }))
    }
  }, [userProfile])

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Requirement #5: Input validation with meaningful, friendly error messages
  const validate = (data) => {
    const errs = {}

    if (!data.name.trim()) {
      errs.name = 'Please enter your full name'
    } else if (data.name.trim().length < 3) {
      errs.name = 'Name should be at least 3 characters long'
    }

    if (!data.email.trim()) {
      errs.email = 'Please enter your email address'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errs.email = 'Please enter a valid email address (e.g., name@example.com)'
    }

    if (!data.skill.trim()) {
      errs.skill = 'Please describe the skill you want to teach'
    } else if (data.skill.trim().length < 5) {
      errs.skill = 'Skill description should be at least 5 characters'
    }

    if (!data.category) {
      errs.category = 'Please select a category for your skill'
    }

    if (!data.experienceLevel) {
      errs.experienceLevel = 'Please select your experience level'
    }

    if (!data.district) {
      errs.district = 'Please select your district in Sri Lanka'
    }

    if (!data.description.trim()) {
      errs.description = 'Please tell learners about yourself and what you teach'
    } else if (data.description.trim().length < 20) {
      errs.description = 'Description should be at least 20 characters — help learners understand what they\'ll gain!'
    }

    if (data.availability.length === 0) {
      errs.availability = 'Please select at least one availability option'
    }

    if (!data.contactMethod) {
      errs.contactMethod = 'Please choose how learners can reach you'
    }

    return errs
  }

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    if (touched[field]) {
      setErrors(validate(newData))
    }
  }

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true })
    setErrors(validate(formData))
  }

  const toggleAvailability = (option) => {
    const current = formData.availability
    const updated = current.includes(option)
      ? current.filter(a => a !== option)
      : [...current, option]
    handleChange('availability', updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const allTouched = {}
    Object.keys(formData).forEach(k => allTouched[k] = true)
    setTouched(allTouched)

    const validationErrors = validate(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true)

      const newMentor = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        skill: formData.skill.trim(),
        category: formData.category,
        experienceLevel: formData.experienceLevel,
        district: formData.district,
        description: formData.description.trim(),
        availability: formData.availability,
        contactMethod: formData.contactMethod,
        rating: 5.0,
        studentsCount: 1,
        avatar: isTeacher
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        isVerified: Boolean(isVerified),
        lecturerId: userProfile?.lecturerId || null,
        institution: userProfile?.institution || null,
        createdAt: new Date().toISOString()
      }

      // 1. Persist to Firestore if configured
      if (isFirebaseConfigured && db) {
        try {
          const docRef = await addDoc(collection(db, 'mentors'), newMentor)
          newMentor.id = docRef.id
        } catch (err) {
          console.warn('Firestore mentor submission warning:', err.message)
        }
      }

      // 2. Always persist to localStorage for immediate Explore integration
      try {
        const existingRaw = localStorage.getItem('epedia_custom_mentors')
        const existing = existingRaw ? JSON.parse(existingRaw) : []
        newMentor.id = newMentor.id || 'mentor_' + Date.now()
        existing.unshift(newMentor)
        localStorage.setItem('epedia_custom_mentors', JSON.stringify(existing))
      } catch (e) {
        console.warn('Local storage cache warning:', e)
      }

      setIsSubmitting(false)
      setShowSuccess(true)
    }
  }

  const availabilityOptions = ['Weekdays', 'Weekends', 'Evenings']
  const contactMethods = ['Email', 'Phone', 'WhatsApp']

  return (
    <main className="form-page" id="teach-form-page">
      <div className="container">
        <div className="form-container">
          <div className="form-header">
            <h1>
              Share Your <span className="gradient-text">Knowledge</span>
            </h1>
            <p>
              Register as a mentor on E-Pedia and help fellow Sri Lankans
              learn new skills. Fill in your details below.
            </p>
          </div>

          {/* User Role & Credential Status Banner */}
          {userProfile ? (
            <div style={{
              background: isTeacher ? 'rgba(0, 212, 170, 0.08)' : 'rgba(108, 99, 255, 0.08)',
              border: `1px solid ${isTeacher ? 'rgba(0, 212, 170, 0.25)' : 'rgba(108, 99, 255, 0.25)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '14px 18px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: isTeacher ? 'var(--secondary)' : 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isTeacher ? '#060612' : '#ffffff'
                }}>
                  {isTeacher ? <GraduationCap size={20} /> : <Sparkles size={18} />}
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Logged in as {userProfile.name} {isTeacher ? '(Teacher / Mentor)' : '(Learner)'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {isTeacher
                      ? `Credentials verified • ID: ${userProfile.lecturerId || 'LEC-OK'} • Level: ${userProfile.teachingLevel || 'Expert'}`
                      : 'Creating this listing will publish your mentor profile on E-Pedia'}
                  </div>
                </div>
              </div>

              {isVerified && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--success)',
                  background: 'rgba(46, 213, 115, 0.12)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(46, 213, 115, 0.3)'
                }}>
                  <ShieldCheck size={14} /> ID VERIFIED
                </span>
              )}
            </div>
          ) : (
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px dashed var(--border-glass)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 18px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px',
              fontSize: '0.85rem'
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                💡 Tip: <Link to="/auth?mode=register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Create a Teacher Account</Link> to get a Verified Credential Badge on your mentor card.
              </span>
            </div>
          )}

          {/* Requirement #4: Form that accepts user input */}
          <form className="form-card glass-card" onSubmit={handleSubmit} noValidate id="teach-form">

            {/* Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                className={`form-input ${errors.name && touched.name ? 'error' : ''}`}
                placeholder="e.g., Kasun Perera"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
              />
              {errors.name && touched.name && (
                <div className="form-error">
                  <AlertCircle size={14} /> {errors.name}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                className={`form-input ${errors.email && touched.email ? 'error' : ''}`}
                placeholder="e.g., kasun@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
              />
              {errors.email && touched.email && (
                <div className="form-error">
                  <AlertCircle size={14} /> {errors.email}
                </div>
              )}
            </div>

            {/* Skill */}
            <div className="form-group">
              <label className="form-label" htmlFor="skill">
                Skill / Subject You Teach <span className="required">*</span>
              </label>
              <input
                type="text"
                id="skill"
                className={`form-input ${errors.skill && touched.skill ? 'error' : ''}`}
                placeholder="e.g., Web Development (React & Node.js)"
                value={formData.skill}
                onChange={(e) => handleChange('skill', e.target.value)}
                onBlur={() => handleBlur('skill')}
              />
              {errors.skill && touched.skill && (
                <div className="form-error">
                  <AlertCircle size={14} /> {errors.skill}
                </div>
              )}
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label" htmlFor="category">
                Category <span className="required">*</span>
              </label>
              <select
                id="category"
                className={`form-select ${errors.category && touched.category ? 'error' : ''}`}
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                onBlur={() => handleBlur('category')}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && touched.category && (
                <div className="form-error">
                  <AlertCircle size={14} /> {errors.category}
                </div>
              )}
            </div>

            {/* Experience Level */}
            <div className="form-group">
              <label className="form-label">
                Experience Level <span className="required">*</span>
              </label>
              <div className="radio-group">
                {experienceLevels.map(level => (
                  <label
                    key={level}
                    className={`radio-label ${formData.experienceLevel === level ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="experienceLevel"
                      value={level}
                      checked={formData.experienceLevel === level}
                      onChange={(e) => handleChange('experienceLevel', e.target.value)}
                    />
                    {level}
                  </label>
                ))}
              </div>
              {errors.experienceLevel && touched.experienceLevel && (
                <div className="form-error">
                  <AlertCircle size={14} /> {errors.experienceLevel}
                </div>
              )}
            </div>

            {/* District */}
            <div className="form-group">
              <label className="form-label" htmlFor="district">
                District <span className="required">*</span>
              </label>
              <select
                id="district"
                className={`form-select ${errors.district && touched.district ? 'error' : ''}`}
                value={formData.district}
                onChange={(e) => handleChange('district', e.target.value)}
                onBlur={() => handleBlur('district')}
              >
                <option value="">Select your district</option>
                {districts.map(dist => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
              {errors.district && touched.district && (
                <div className="form-error">
                  <AlertCircle size={14} /> {errors.district}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="description">
                About You & What You Teach <span className="required">*</span>
              </label>
              <textarea
                id="description"
                className={`form-textarea ${errors.description && touched.description ? 'error' : ''}`}
                placeholder="Tell learners about your experience, what they'll learn, and why you're passionate about teaching this skill..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                onBlur={() => handleBlur('description')}
                rows={5}
              />
              {errors.description && touched.description && (
                <div className="form-error">
                  <AlertCircle size={14} /> {errors.description}
                </div>
              )}
              <div style={{ textAlign: 'right', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                {formData.description.length} / 20 min characters
              </div>
            </div>

            {/* Availability */}
            <div className="form-group">
              <label className="form-label">
                Availability <span className="required">*</span>
              </label>
              <div className="checkbox-group">
                {availabilityOptions.map(option => (
                  <label
                    key={option}
                    className={`checkbox-label ${formData.availability.includes(option) ? 'checked' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.availability.includes(option)}
                      onChange={() => toggleAvailability(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
              {errors.availability && touched.availability && (
                <div className="form-error">
                  <AlertCircle size={14} /> {errors.availability}
                </div>
              )}
            </div>

            {/* Contact Method */}
            <div className="form-group">
              <label className="form-label">
                Preferred Contact Method <span className="required">*</span>
              </label>
              <div className="radio-group">
                {contactMethods.map(method => (
                  <label
                    key={method}
                    className={`radio-label ${formData.contactMethod === method ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="contactMethod"
                      value={method}
                      checked={formData.contactMethod === method}
                      onChange={(e) => handleChange('contactMethod', e.target.value)}
                    />
                    {method}
                  </label>
                ))}
              </div>
              {errors.contactMethod && touched.contactMethod && (
                <div className="form-error">
                  <AlertCircle size={14} /> {errors.contactMethod}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary form-submit"
              disabled={isSubmitting}
              id="submit-btn"
            >
              {isSubmitting ? (
                <>
                  <div className="spinner" /> Submitting...
                </>
              ) : (
                <>
                  <Send size={20} /> Register as a Mentor
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="modal-overlay" id="success-modal" onClick={() => {
          setShowSuccess(false)
          navigate('/explore')
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <CheckCircle size={36} />
            </div>
            <h2>Welcome to E-Pedia! 🎉</h2>
            <p>
              Thank you for registering as a mentor, <strong>{formData.name}</strong>!
              Your profile is now live and learners can find you.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowSuccess(false)
                navigate('/explore')
              }}
              id="success-close-btn"
            >
              View Mentors
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

export default TeachForm
