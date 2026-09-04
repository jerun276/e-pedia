import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../firebase/AuthContext'
import { 
  Menu, X, Sparkles, LogIn, LogOut, User, 
  GraduationCap, ShieldCheck, BookOpen, ChevronDown, CheckCircle
} from 'lucide-react'

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { isLoggedIn, userProfile, isTeacher, isAdmin, isVerified, logout } = useAuth()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/explore', label: 'Explore' },
    { path: '/quiz', label: 'AI Quiz', isAi: true },
    { path: '/about', label: 'About' },
  ]

  const handleLogout = async () => {
    setMobileOpen(false)
    setDropdownOpen(false)
    await logout()
    navigate('/')
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <>
      <nav className="navbar" id="main-nav">
        <div className="container" style={{ position: 'relative' }}>
          {/* Logo */}
          <Link to="/" className="nav-logo" id="nav-logo">
            <div className="nav-logo-icon">E</div>
            <span>E-Pedia</span>
          </Link>

          {/* Main Links */}
          <ul className="nav-links" id="nav-links">
            {navItems.map(item => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => isActive ? 'active' : ''}
                  end={item.path === '/'}
                >
                  {item.isAi ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <Sparkles size={14} style={{ color: 'var(--accent-amber)' }} />
                      {item.label}
                    </span>
                  ) : (
                    item.label
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right Action / Auth Status */}
          <div className="nav-actions desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {isLoggedIn ? (
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                {/* Profile Trigger Button */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '30px',
                    padding: '4px 14px 4px 6px',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: dropdownOpen ? '0 0 12px rgba(108, 99, 255, 0.4)' : 'none'
                  }}
                  className="nav-profile-btn"
                  id="nav-profile-dropdown-btn"
                >
                  {/* Avatar Icon / Circle */}
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
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
                      fontSize: '0.85rem'
                    }}
                  >
                    {getInitials(userProfile?.name)}
                  </div>

                  {/* User Name & Role Pill */}
                  <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {userProfile?.name || 'User'}
                    </div>
                    <div style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: isAdmin ? '#FF5252' : isTeacher ? 'var(--secondary)' : 'var(--primary-light)'
                    }}>
                      {isAdmin ? 'ADMIN' : isTeacher ? 'TEACHER' : 'LEARNER'}
                    </div>
                  </div>

                  <ChevronDown size={14} style={{
                    color: 'var(--text-tertiary)',
                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }} />
                </button>

                {/* Profile Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 10px)',
                      width: '280px',
                      background: 'rgba(15, 15, 35, 0.96)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '16px',
                      padding: '16px',
                      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08)',
                      zIndex: 1200,
                      animation: 'slideDown 0.2s ease'
                    }}
                    id="profile-dropdown-menu"
                  >
                    {/* User Card Header */}
                    <div style={{ paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
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
                            fontWeight: 800,
                            fontSize: '1rem'
                          }}
                        >
                          {getInitials(userProfile?.name)}
                        </div>

                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {userProfile?.name}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {userProfile?.email}
                          </div>
                        </div>
                      </div>

                      {/* Badges */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: isAdmin ? 'rgba(255, 82, 82, 0.15)' : isTeacher ? 'rgba(0, 212, 170, 0.15)' : 'rgba(108, 99, 255, 0.15)',
                          color: isAdmin ? '#FF5252' : isTeacher ? 'var(--secondary)' : 'var(--primary-light)',
                          border: `1px solid ${isAdmin ? 'rgba(255, 82, 82, 0.3)' : isTeacher ? 'rgba(0, 212, 170, 0.3)' : 'rgba(108, 99, 255, 0.3)'}`
                        }}>
                          {isAdmin ? 'ADMINISTRATOR' : isTeacher ? 'TEACHER / MENTOR' : 'STUDENT / LEARNER'}
                        </span>

                        {isVerified && (
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '12px',
                            background: 'rgba(46, 213, 115, 0.15)',
                            color: 'var(--success)',
                            border: '1px solid rgba(46, 213, 115, 0.3)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <CheckCircle size={10} /> VERIFIED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Navigation Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <Link
                        to="/profile/me"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          color: 'var(--text-primary)',
                          fontSize: '0.88rem',
                          fontWeight: 500,
                          transition: 'background 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <User size={16} style={{ color: 'var(--text-secondary)' }} />
                        My Profile & ID Card
                      </Link>

                      <Link
                        to="/messages"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          color: 'var(--text-primary)',
                          fontSize: '0.88rem',
                          fontWeight: 500,
                          transition: 'background 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <MessageCircle size={16} style={{ color: 'var(--text-secondary)' }} />
                        Messages
                      </Link>

                      {isTeacher && (
                        <Link
                          to="/teach"
                          onClick={() => setDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            color: 'var(--text-primary)',
                            fontSize: '0.88rem',
                            fontWeight: 500
                          }}
                          className="dropdown-item"
                        >
                          <GraduationCap size={16} style={{ color: 'var(--secondary)' }} />
                          <span>Mentor Studio</span>
                        </Link>
                      )}

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            color: 'var(--text-primary)',
                            fontSize: '0.88rem',
                            fontWeight: 500
                          }}
                          className="dropdown-item"
                        >
                          <ShieldCheck size={16} style={{ color: '#FF5252' }} />
                          <span>Admin Console</span>
                        </Link>
                      )}

                      <Link
                        to="/quiz"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          color: 'var(--text-primary)',
                          fontSize: '0.88rem',
                          fontWeight: 500
                        }}
                        className="dropdown-item"
                      >
                        <Sparkles size={16} style={{ color: 'var(--accent-amber)' }} />
                        <span>AI Learning Assistant</span>
                      </Link>
                    </div>

                    <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '8px 0' }} />

                    {/* Sign Out Action */}
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        color: '#FF6B6B',
                        background: 'rgba(255, 107, 107, 0.08)',
                        border: '1px solid rgba(255, 107, 107, 0.2)',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      className="dropdown-logout-btn"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/teach"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.85rem' }}
                >
                  Start Teaching
                </Link>
                <Link
                  to="/auth"
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                >
                  <LogIn size={15} />
                  <span>Sign In / Register</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            id="hamburger-btn"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`} id="mobile-menu">
        {isLoggedIn && userProfile && (
          <div style={{
            padding: '16px',
            marginBottom: '16px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: isTeacher ? 'var(--secondary)' : 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700
              }}
            >
              {getInitials(userProfile.name)}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{userProfile.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden' }}>{userProfile.email}</div>
            </div>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '10px',
              background: isTeacher ? 'rgba(0, 212, 170, 0.2)' : 'rgba(108, 99, 255, 0.2)',
              color: isTeacher ? 'var(--secondary)' : 'var(--primary-light)'
            }}>
              {isTeacher ? 'TEACHER' : 'LEARNER'}
            </span>
          </div>
        )}

        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => isActive ? 'active' : ''}
            end={item.path === '/'}
            onClick={() => setMobileOpen(false)}
          >
            {item.label}
          </NavLink>
        ))}

        {isLoggedIn && (
          <>
            <NavLink
              to="/profile/me"
              onClick={() => setMobileOpen(false)}
            >
              My Profile & ID Card
            </NavLink>

            <NavLink
              to="/messages"
              onClick={() => setMobileOpen(false)}
            >
              Messages
            </NavLink>
            
            {isTeacher && (
              <NavLink
                to="/teach"
                onClick={() => setMobileOpen(false)}
              >
                Mentor Studio
              </NavLink>
            )}

            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => setMobileOpen(false)}
              >
                Admin Console
              </NavLink>
            )}
          </>
        )}

        {!isLoggedIn ? (
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link
              to="/auth"
              className="btn btn-primary"
              onClick={() => setMobileOpen(false)}
              style={{ justifyContent: 'center' }}
            >
              <LogIn size={18} /> Sign In / Register
            </Link>
            <Link
              to="/teach"
              className="btn btn-secondary"
              onClick={() => setMobileOpen(false)}
              style={{ justifyContent: 'center' }}
            >
              Start Teaching
            </Link>
          </div>
        ) : (
          <button
            className="btn btn-outline"
            onClick={handleLogout}
            style={{ marginTop: '20px', justifyContent: 'center', color: '#ff6b6b', borderColor: 'rgba(255, 107, 107, 0.4)' }}
          >
            <LogOut size={18} /> Sign Out
          </button>
        )}
      </div>
    </>
  )
}

export default Navbar
