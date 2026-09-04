import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>
              <span className="nav-logo-icon" style={{ width: 28, height: 28, fontSize: '0.85rem' }}>E</span>
              E-Pedia
            </h3>
            <p>
              Bridging the knowledge gap in Sri Lanka by connecting skilled
              mentors with eager learners. Every skill shared is a life
              transformed.
            </p>
          </div>

          <div className="footer-links">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/explore">Explore Mentors</Link></li>
              <li><Link to="/teach">Share Your Skill</Link></li>
              <li><Link to="/about">About E-Pedia</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Resources</h4>
            <ul>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © 2026 E-Pedia. Built with <Heart size={14} style={{ display: 'inline', verticalAlign: 'middle', color: '#ff4757' }} /> for
            Sri Lanka | SE3090 Mini Hackathon
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
