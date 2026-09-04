import { Link } from 'react-router-dom'
import { Heart, Target, Users, Lightbulb, Globe, BookOpen, ArrowRight } from 'lucide-react'

function About() {
  return (
    <main className="about-page" id="about-page">
      <div className="container">

        {/* Hero */}
        <div className="about-hero">
          <h1>
            About <span className="gradient-text">E-Pedia</span>
          </h1>
          <p>
            E-Pedia is Sri Lanka's first dedicated skill-sharing and knowledge exchange platform,
            built to bridge the education access gap and empower communities across the island.
          </p>
        </div>

        {/* Problem & Solution Cards */}
        <div className="about-grid">
          <div className="about-card glass-card">
            <h3>
              <Target size={22} style={{ color: 'var(--accent)' }} />
              The Problem
            </h3>
            <p>
              Sri Lanka faces a significant education access gap, particularly in rural areas.
              Despite having millions of skilled and knowledgeable citizens, there is no centralized
              platform to connect those who know with those who want to learn.
            </p>
            <ul>
              <li>46% of rural youth lack access to skill development programs</li>
              <li>72% of small-scale artisans have no digital presence</li>
              <li>Traditional skills and cultural knowledge are being lost</li>
              <li>Geographic barriers prevent knowledge sharing across districts</li>
            </ul>
          </div>

          <div className="about-card glass-card">
            <h3>
              <Lightbulb size={22} style={{ color: 'var(--secondary)' }} />
              Our Solution
            </h3>
            <p>
              E-Pedia creates a digital bridge between knowledge holders and knowledge seekers.
              Our platform allows anyone with a valuable skill to register as a mentor and
              make themselves discoverable to learners across Sri Lanka.
            </p>
            <ul>
              <li>Register as a mentor in under 2 minutes</li>
              <li>Search & filter mentors by skill, location, and level</li>
              <li>Covering all 25 districts of Sri Lanka</li>
              <li>10+ skill categories from tech to traditional crafts</li>
            </ul>
          </div>

          <div className="about-card glass-card">
            <h3>
              <Users size={22} style={{ color: 'var(--primary-light)' }} />
              Who It Helps
            </h3>
            <p>
              E-Pedia serves two key groups in Sri Lankan society:
            </p>
            <ul>
              <li><strong>Learners:</strong> Students, job seekers, hobbyists, and anyone wanting to gain new skills</li>
              <li><strong>Mentors:</strong> Skilled professionals, artisans, teachers, and community leaders</li>
              <li><strong>Communities:</strong> Rural and urban areas that benefit from knowledge exchange</li>
              <li><strong>The Economy:</strong> More skilled workers means more economic opportunity</li>
            </ul>
          </div>

          <div className="about-card glass-card">
            <h3>
              <Heart size={22} style={{ color: '#ff4757' }} />
              Our Impact
            </h3>
            <p>
              By connecting mentors and learners, E-Pedia creates real, measurable impact:
            </p>
            <ul>
              <li>Preserve traditional Sri Lankan crafts and cultural knowledge</li>
              <li>Help young people develop employable skills</li>
              <li>Enable artisans and professionals to earn income by teaching</li>
              <li>Break down geographical barriers to education across the island</li>
            </ul>
          </div>
        </div>

        {/* Skill Categories */}
        <div className="section" style={{ textAlign: 'center' }}>
          <h2 className="section-title">
            Skill <span className="gradient-text">Categories</span>
          </h2>
          <p className="section-subtitle">
            From cutting-edge technology to centuries-old traditions — every skill has value
          </p>

          <div className="features-grid" style={{ marginTop: 32 }}>
            {[
              { icon: <Globe size={28} />, name: 'Technology', desc: 'Web dev, mobile apps, data science, AI' },
              { icon: <BookOpen size={28} />, name: 'Languages', desc: 'English, Tamil, Sinhala, Japanese, Korean' },
              { icon: <Heart size={28} />, name: 'Arts & Crafts', desc: 'Batik, weaving, pottery, woodwork, painting' },
              { icon: <Target size={28} />, name: 'Business', desc: 'Accounting, marketing, entrepreneurship' },
              { icon: <Lightbulb size={28} />, name: 'Agriculture', desc: 'Organic farming, gardening, permaculture' },
              { icon: <Users size={28} />, name: 'Health & Wellness', desc: 'Yoga, Ayurveda, nutrition, mental health' },
            ].map(cat => (
              <div key={cat.name} className="feature-card glass-card">
                <div className="feature-icon">{cat.icon}</div>
                <h3>{cat.name}</h3>
                <p>{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="section" style={{ textAlign: 'center' }}>
          <h2 className="section-title">
            Join the <span className="gradient-text">Movement</span>
          </h2>
          <p className="section-subtitle">
            Whether you want to teach or learn, E-Pedia has a place for you.
            Together, we can build a more knowledgeable, connected Sri Lanka.
          </p>
          <div className="hero-actions">
            <Link to="/teach" className="btn btn-accent btn-lg">
              Become a Mentor
              <ArrowRight size={20} />
            </Link>
            <Link to="/explore" className="btn btn-secondary btn-lg">
              Find a Mentor
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default About
