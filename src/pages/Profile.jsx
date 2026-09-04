import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Star, Users, Clock, Mail, Phone, MessageCircle } from 'lucide-react'
import { sampleMentors } from '../data/sampleData'

function Profile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const mentor = sampleMentors.find(m => m.id === id)

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
                {mentor.rating}
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

          {/* Contact CTA */}
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button
              className="btn btn-accent btn-lg"
              onClick={() => {
                alert(`In a production app, this would open a contact form or message to ${mentor.name} via ${mentor.contactMethod}.`)
              }}
              id="contact-mentor-btn"
            >
              {contactIcons[mentor.contactMethod]}
              Contact {mentor.name.split(' ')[0]} via {mentor.contactMethod}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Profile
