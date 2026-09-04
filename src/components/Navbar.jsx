import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/explore', label: 'Explore' },
    { path: '/about', label: 'About' },
  ]

  const handleCTA = () => {
    setMobileOpen(false)
    navigate('/teach')
  }

  return (
    <>
      <nav className="navbar" id="main-nav">
        <div className="container">
          <Link to="/" className="nav-logo" id="nav-logo">
            <div className="nav-logo-icon">E</div>
            <span>E-Pedia</span>
          </Link>

          <ul className="nav-links" id="nav-links">
            {navItems.map(item => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => isActive ? 'active' : ''}
                  end={item.path === '/'}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <button
            className="btn btn-primary btn-sm nav-cta desktop-only"
            onClick={handleCTA}
            id="nav-cta-btn"
          >
            Start Teaching
          </button>

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

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`} id="mobile-menu">
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
        <button
          className="btn btn-primary"
          onClick={handleCTA}
          style={{ marginTop: '16px' }}
        >
          Start Teaching
        </button>
      </div>
    </>
  )
}

export default Navbar
