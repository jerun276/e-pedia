import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { User, LogIn, LogOut, ShieldCheck, Sparkles, GraduationCap, BookOpen } from 'lucide-react'

export function AuthBar() {
  const { currentUser, userProfile, isLoggedIn, isTeacher, isVerified, logout, quickDemoLogin } = useAuth()
  const navigate = useNavigate()

  return (
    <div
      id="epedia-auth-bar"
      style={{
        background: 'linear-gradient(90deg, rgba(10, 10, 26, 0.95), rgba(20, 20, 48, 0.95))',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        fontSize: '0.8rem',
        padding: '6px 16px',
        color: 'var(--text-secondary)',
        position: 'relative',
        zIndex: 1100
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        {/* Left: Current Active Role / Welcome message */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isLoggedIn && userProfile ? (
            <>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontWeight: 600,
                  color: isTeacher ? 'var(--secondary)' : 'var(--primary-light)',
                  background: isTeacher ? 'rgba(0, 212, 170, 0.12)' : 'rgba(108, 99, 255, 0.15)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  border: `1px solid ${isTeacher ? 'rgba(0, 212, 170, 0.3)' : 'rgba(108, 99, 255, 0.3)'}`
                }}
              >
                {isTeacher ? <GraduationCap size={13} /> : <BookOpen size={13} />}
                {isTeacher ? 'Teacher / Mentor' : 'Learner'}
              </span>

              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                {userProfile.name}
              </span>

              {isVerified && (
                <span
                  title="Official ID Verified Credentials"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    color: 'var(--success)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    background: 'rgba(46, 213, 115, 0.1)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid rgba(46, 213, 115, 0.25)'
                  }}
                >
                  <ShieldCheck size={12} /> VERIFIED
                </span>
              )}

              {isTeacher && userProfile.teachingLevel && (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  • Level: <strong style={{ color: 'var(--secondary)' }}>{userProfile.teachingLevel}</strong>
                </span>
              )}
            </>
          ) : (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--primary-light)' }}>🇱🇰 E-Pedia Dual Roles:</span>
              <span>Register as a <strong>Learner</strong> or share your skills as a <strong>Teacher</strong></span>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isLoggedIn ? (
            <>
              <Link
                to="/auth"
                style={{
                  color: 'var(--text-secondary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'color var(--transition-fast)'
                }}
              >
                <User size={13} /> My Profile & ID
              </Link>

              {isTeacher && (
                <Link
                  to="/teach"
                  style={{
                    color: 'var(--secondary)',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  Mentor Studio
                </Link>
              )}

              <button
                onClick={logout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--error)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.78rem',
                  padding: 0
                }}
              >
                <LogOut size={12} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Quick Test:</span>
                <button
                  type="button"
                  onClick={() => {
                    quickDemoLogin('learner')
                    navigate('/explore')
                  }}
                  style={{
                    background: 'rgba(108, 99, 255, 0.15)',
                    border: '1px solid rgba(108, 99, 255, 0.3)',
                    color: 'var(--primary-light)',
                    borderRadius: 'var(--radius-full)',
                    padding: '2px 8px',
                    fontSize: '0.72rem',
                    cursor: 'pointer'
                  }}
                >
                  Demo Learner
                </button>
                <button
                  type="button"
                  onClick={() => {
                    quickDemoLogin('teacher')
                    navigate('/teach')
                  }}
                  style={{
                    background: 'rgba(0, 212, 170, 0.12)',
                    border: '1px solid rgba(0, 212, 170, 0.3)',
                    color: 'var(--secondary)',
                    borderRadius: 'var(--radius-full)',
                    padding: '2px 8px',
                    fontSize: '0.72rem',
                    cursor: 'pointer'
                  }}
                >
                  Demo Teacher
                </button>
              </div>

              <Link
                to="/auth"
                style={{
                  color: 'var(--primary-light)',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <LogIn size={13} /> Sign In / Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthBar
