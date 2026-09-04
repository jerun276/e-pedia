import { useState } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { useAuth } from '../firebase/AuthContext'
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react'
import { categories } from '../data/sampleData'

function Auth() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login'
  const [mode, setMode] = useState(initialMode) // 'login' | 'register'
  const [role, setRole] = useState('learner') // 'learner' | 'teacher'

  const redirectPath = location.state?.from || null

  const { login, register, quickDemoLogin, currentUser, userProfile, logout } = useAuth()
  const navigate = useNavigate()

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    lecturerId: '',
    institution: '',
    teachingLevel: 'Intermediate',
    skillCategory: 'Technology',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    if (authError) setAuthError('')
  }

  const validate = () => {
    const errs = {}
    if (mode === 'register') {
      if (!formData.name.trim()) errs.name = 'Full name is required'
      if (formData.name.trim().length < 3) errs.name = 'Name must be at least 3 characters'
    }

    if (!formData.email.trim()) {
      errs.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address'
    }


    if (!formData.password) {
      errs.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters'
    }

    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match'
    }

    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAuthError('')
    setSuccessMessage('')

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)

    try {
      if (mode === 'login') {
        const res = await login(formData.email, formData.password)
        if (res.success) {
          setSuccessMessage('Successfully signed in! Redirecting...')
          setTimeout(() => {
            navigate(redirectPath || (res.profile.role === 'teacher' ? '/teach' : '/explore'))
          }, 800)
        }
      } else {
        const res = await register({
          ...formData,
          role
        })
        if (res.success) {
          setSuccessMessage('Account created successfully! Welcome to E-Pedia.')
          setTimeout(() => {
            navigate(redirectPath || (role === 'teacher' ? '/teach' : '/explore'))
          }, 900)
        }
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDemoLogin = (roleType) => {
    quickDemoLogin(roleType)
    setSuccessMessage(`Signed in as Demo ${roleType === 'teacher' ? 'Teacher' : 'Learner'}! Redirecting...`)
    setTimeout(() => {
      navigate(redirectPath || (roleType === 'teacher' ? '/teach' : '/explore'))
    }, 700)
  }

  // If already logged in, show active profile card with quick actions
  if (currentUser && userProfile) {
    return (
      <main className="form-page" id="auth-profile-active-page">
        <div className="container" style={{ maxWidth: '640px', margin: '40px auto' }}>
          <div className="glass-card" style={{ padding: '36px', textAlign: 'center' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: userProfile.role === 'teacher'
                ? 'linear-gradient(135deg, var(--secondary), #009977)'
                : 'linear-gradient(135deg, var(--primary), var(--primary-light))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: 'var(--shadow-glow)'
            }}>
              {userProfile.role === 'teacher' ? (
                <GraduationCap size={36} color="#060612" />
              ) : (
                <BookOpen size={36} color="#ffffff" />
              )}
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: userProfile.role === 'teacher' ? 'rgba(0, 212, 170, 0.15)' : 'rgba(108, 99, 255, 0.15)',
                color: userProfile.role === 'teacher' ? 'var(--secondary)' : 'var(--primary-light)',
                border: `1px solid ${userProfile.role === 'teacher' ? 'rgba(0, 212, 170, 0.3)' : 'rgba(108, 99, 255, 0.3)'}`
              }}>
                {userProfile.role === 'teacher' ? '👨‍🏫 Teacher / Mentor' : '🎓 Learner'}
              </span>

              {userProfile.isVerified && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(46, 213, 115, 0.15)',
                  color: 'var(--success)',
                  border: '1px solid rgba(46, 213, 115, 0.3)'
                }}>
                  <ShieldCheck size={13} /> VERIFIED
                </span>
              )}
            </div>

            <h2 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>{userProfile.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>
              {userProfile.email}
            </p>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              textAlign: 'left',
              marginBottom: '28px',
              fontSize: '0.9rem'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>
                    {userProfile.role === 'teacher' ? 'Lecturer ID' : 'Student ID'}
                  </span>
                  <strong>{userProfile.role === 'teacher' ? userProfile.lecturerId || 'N/A' : userProfile.studentId || 'N/A'}</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Institution</span>
                  <strong>{userProfile.institution || 'Sri Lanka Education'}</strong>
                </div>

                {userProfile.role === 'teacher' && (
                  <>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Teaching Level</span>
                      <strong style={{ color: 'var(--secondary)' }}>{userProfile.teachingLevel || 'Intermediate'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Category</span>
                      <strong>{userProfile.skillCategory || 'Technology'}</strong>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {userProfile.role === 'teacher' ? (
                <button
                  onClick={() => navigate('/teach')}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  Go to Mentor Studio <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => navigate('/explore')}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  Explore Mentors <ArrowRight size={16} />
                </button>
              )}

              <button
                onClick={() => navigate('/quiz')}
                className="btn btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Sparkles size={16} /> AI Quiz
              </button>

              <button
                onClick={logout}
                className="btn"
                style={{
                  background: 'rgba(255, 71, 87, 0.1)',
                  color: 'var(--error)',
                  border: '1px solid rgba(255, 71, 87, 0.3)'
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="form-page" id="auth-page" style={{ minHeight: 'calc(100vh - 80px)', padding: '40px 16px' }}>
      <div className="container" style={{ maxWidth: '560px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>
            {mode === 'login' ? 'Welcome Back to ' : 'Join '}
            <span className="gradient-text">E-Pedia</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {mode === 'login'
              ? 'Sign in to connect with Sri Lankan mentors and expand your skills'
              : 'Empowering knowledge exchange across Sri Lanka — Choose your role'}
          </p>
        </div>

        {location.state?.message && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '12px',
            background: 'rgba(108, 99, 255, 0.15)',
            border: '1px solid rgba(108, 99, 255, 0.3)',
            color: 'var(--primary-light)',
            fontSize: '0.9rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Sparkles size={18} style={{ flexShrink: 0, color: 'var(--accent-amber)' }} />
            <span>{location.state.message}</span>
          </div>
        )}

        {/* Mode Switcher Tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 'var(--radius-full)',
          padding: '4px',
          marginBottom: '24px',
          border: '1px solid var(--border-glass)'
        }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrors({}); setAuthError('') }}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: mode === 'login' ? 'var(--primary)' : 'transparent',
              color: mode === 'login' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrors({}); setAuthError('') }}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: mode === 'register' ? 'var(--primary)' : 'transparent',
              color: mode === 'register' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Form Container */}
        <div className="glass-card" style={{ padding: '32px' }}>


          {authError && (
            <div style={{
              background: 'var(--error-bg)',
              color: 'var(--error)',
              border: '1px solid rgba(255, 71, 87, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              fontSize: '0.85rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} /> {authError}
            </div>
          )}

          {successMessage && (
            <div style={{
              background: 'var(--success-bg)',
              color: 'var(--success)',
              border: '1px solid rgba(46, 213, 115, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              fontSize: '0.85rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} /> {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* DUAL ROLE SELECTOR (Visible on Register) */}
            {mode === 'register' && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '10px', color: 'var(--text-secondary)' }}>
                  Select Account Type <span style={{ color: 'var(--accent)' }}>*</span>
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {/* Learner Card */}
                  <div
                    onClick={() => setRole('learner')}
                    style={{
                      cursor: 'pointer',
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      background: role === 'learner' ? 'rgba(108, 99, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1.5px solid ${role === 'learner' ? 'var(--primary)' : 'var(--border-glass)'}`,
                      transition: 'all var(--transition-fast)',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: role === 'learner' ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px'
                    }}>
                      <BookOpen size={20} color="#ffffff" />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: role === 'learner' ? 'var(--primary-light)' : 'var(--text-primary)' }}>
                      🎓 Learner
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Take AI quizzes, learn skills & rate mentors
                    </div>
                  </div>

                  {/* Teacher Card */}
                  <div
                    onClick={() => setRole('teacher')}
                    style={{
                      cursor: 'pointer',
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      background: role === 'teacher' ? 'rgba(0, 212, 170, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1.5px solid ${role === 'teacher' ? 'var(--secondary)' : 'var(--border-glass)'}`,
                      transition: 'all var(--transition-fast)',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: role === 'teacher' ? 'var(--secondary)' : 'rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px'
                    }}>
                      <GraduationCap size={20} color="#060612" />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: role === 'teacher' ? 'var(--secondary)' : 'var(--text-primary)' }}>
                      👨‍🏫 Teacher / Mentor
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Publish profile, teach & mentor learners
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Name Field (Register mode only) */}
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label" htmlFor="auth-name">
                  Full Name <span className="required">*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    id="auth-name"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="e.g., Ananda Jayasinghe"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                {errors.name && <div className="form-error"><AlertCircle size={14} /> {errors.name}</div>}
              </div>
            )}

            {/* Email Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="auth-email">
                Email Address <span className="required">*</span>
              </label>
              <input
                type="email"
                id="auth-email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="e.g., student@university.lk"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              {errors.email && <div className="form-error"><AlertCircle size={14} /> {errors.email}</div>}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="auth-password">
                Password <span className="required">*</span>
              </label>
              <input
                type="password"
                id="auth-password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
              {errors.password && <div className="form-error"><AlertCircle size={14} /> {errors.password}</div>}
            </div>

            {/* Confirm Password (Register mode only) */}
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label" htmlFor="auth-confirm-password">
                  Confirm Password <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="auth-confirm-password"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                />
                {errors.confirmPassword && <div className="form-error"><AlertCircle size={14} /> {errors.confirmPassword}</div>}
              </div>
            )}

            {/* SECTION 1.2: VERIFICATION CREDENTIALS (Register mode only) */}
            {mode === 'register' && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginTop: '8px',
                marginBottom: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: role === 'teacher' ? 'var(--secondary)' : 'var(--primary-light)',
                  marginBottom: '12px'
                }}>
                  <ShieldCheck size={16} />
                  {role === 'teacher' ? 'Lecturer / Teacher Verification Credentials' : 'Student Verification Credentials'}
                </div>

                {role === 'learner' ? (
                  <>
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-label" htmlFor="auth-student-id">
                        Student ID / Index Number <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 400 }}>(Optional - for Verified Badge)</span>
                      </label>
                      <input
                        type="text"
                        id="auth-student-id"
                        className="form-input"
                        placeholder="e.g., IT24102883 or STU/2026/102"
                        value={formData.studentId}
                        onChange={(e) => handleInputChange('studentId', e.target.value)}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" htmlFor="auth-learner-institution">
                        School / University / Institute <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 400 }}>(Optional)</span>
                      </label>
                      <input
                        type="text"
                        id="auth-learner-institution"
                        className="form-input"
                        placeholder="e.g., University of Moratuwa / SLIIT"
                        value={formData.institution}
                        onChange={(e) => handleInputChange('institution', e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-label" htmlFor="auth-lecturer-id">
                        Lecturer ID / Teacher Registration No <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 400 }}>(Optional - for Verified Badge)</span>
                      </label>
                      <input
                        type="text"
                        id="auth-lecturer-id"
                        className="form-input"
                        placeholder="e.g., LEC/2026/SL89 or VTA-889"
                        value={formData.lecturerId}
                        onChange={(e) => handleInputChange('lecturerId', e.target.value)}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-label" htmlFor="auth-teacher-institution">
                        Institution / University / Academy <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 400 }}>(Optional)</span>
                      </label>
                      <input
                        type="text"
                        id="auth-teacher-institution"
                        className="form-input"
                        placeholder="e.g., Faculty of Computing / Craft Guild Sri Lanka"
                        value={formData.institution}
                        onChange={(e) => handleInputChange('institution', e.target.value)}
                      />
                    </div>

                    {/* Teaching Level Specification */}
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-label" htmlFor="auth-teaching-level">
                        Teaching Level Preference <span className="required">*</span>
                      </label>
                      <select
                        id="auth-teaching-level"
                        className="filter-select"
                        style={{ width: '100%', height: '44px' }}
                        value={formData.teachingLevel}
                        onChange={(e) => handleInputChange('teachingLevel', e.target.value)}
                      >
                        <option value="Beginner">Beginner (Foundational concepts & school levels)</option>
                        <option value="Intermediate">Intermediate (Diploma, O/L & A/L, practical skills)</option>
                        <option value="Expert">Expert (University, professional & advanced industry)</option>
                      </select>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                        Specifies your target audience level when sharing knowledge.
                      </span>
                    </div>


                    {/* Skill Category */}
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" htmlFor="auth-skill-category">
                        Primary Teaching Category <span className="required">*</span>
                      </label>
                      <select
                        id="auth-skill-category"
                        className="filter-select"
                        style={{ width: '100%', height: '44px' }}
                        value={formData.skillCategory}
                        onChange={(e) => handleInputChange('skillCategory', e.target.value)}
                      >
                        {categories.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn ${role === 'teacher' && mode === 'register' ? 'btn-secondary' : 'btn-primary'}`}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                marginTop: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner" /> Authenticating...
                </>
              ) : mode === 'login' ? (
                <>Sign In to E-Pedia <ArrowRight size={18} /></>
              ) : (
                <>Complete Registration as {role === 'teacher' ? 'Teacher' : 'Learner'} <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {mode === 'login' ? (
              <>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrors({}); setAuthError('') }}
                  style={{ background: 'none', border: 'none', color: 'var(--primary-light)', cursor: 'pointer', fontWeight: 600 }}
                >
                  Create one here
                </button>
              </>
            ) : (
              <>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrors({}); setAuthError('') }}
                  style={{ background: 'none', border: 'none', color: 'var(--primary-light)', cursor: 'pointer', fontWeight: 600 }}
                >
                  Sign in instead
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </main>
  )
}

export default Auth
