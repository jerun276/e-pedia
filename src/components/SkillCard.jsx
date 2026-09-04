import { Link } from 'react-router-dom'
import { MapPin, Star, Users } from 'lucide-react'

function SkillCard({ mentor }) {
  return (
    <div className="mentor-card glass-card" id={`mentor-card-${mentor.id}`}>
      <div className="mentor-card-header">
        <div className="mentor-avatar">{mentor.avatar}</div>
        <div className="mentor-info">
          <h3>{mentor.name}</h3>
          <p className="mentor-skill">{mentor.skill}</p>
        </div>
      </div>

      <div className="mentor-meta">
        <span className="mentor-badge category">{mentor.category}</span>
        <span className="mentor-badge location">
          <MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
          {mentor.district}
        </span>
        <span className="mentor-badge">{mentor.experienceLevel}</span>
      </div>

      <p className="mentor-description">{mentor.description}</p>

      <div className="mentor-footer">
        <div className="mentor-rating">
          <Star size={16} fill="currentColor" />
          {mentor.rating}
        </div>
        <div className="mentor-students">
          <Users size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
          {mentor.studentsHelped} students helped
        </div>
        <Link to={`/profile/${mentor.id}`} className="btn btn-secondary btn-sm">
          View Profile
        </Link>
      </div>
    </div>
  )
}

export default SkillCard
