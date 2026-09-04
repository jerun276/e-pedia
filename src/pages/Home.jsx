import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { ArrowRight, Search, Users, BookOpen, Globe, TrendingUp, Shield, Lightbulb } from 'lucide-react'
import SkillCard from '../components/SkillCard'
import { sampleMentors } from '../data/sampleData'

function Home() {
  const animateRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    animateRefs.current.forEach(el => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const addRef = (el) => {
    if (el && !animateRefs.current.includes(el)) {
      animateRefs.current.push(el)
    }
  }

  const featuredMentors = sampleMentors.slice(0, 3)

  return (
    <main>
      {/* ===== Hero Section ===== */}
      <section className="hero" id="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Globe size={16} />
              Built for Sri Lanka 🇱🇰
            </div>

            <h1 className="hero-title">
              Share Knowledge,<br />
              <span className="gradient-text">Transform Lives</span>
            </h1>

            <p className="hero-subtitle">
              E-Pedia connects skilled Sri Lankans with eager learners.
              Whether you're a master craftsman, a tech expert, or a language teacher —
              your knowledge can change someone's future.
            </p>

            <div className="hero-actions">
              <Link to="/explore" className="btn btn-primary btn-lg" id="hero-explore-btn">
                <Search size={20} />
                Find a Mentor
              </Link>
              <Link to="/teach" className="btn btn-accent btn-lg" id="hero-teach-btn">
                Start Teaching
                <ArrowRight size={20} />
              </Link>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value gradient-text">500+</div>
                <div className="hero-stat-label">Mentors Registered</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value gradient-text">2,000+</div>
                <div className="hero-stat-label">Learners Connected</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value gradient-text">25</div>
                <div className="hero-stat-label">Districts Covered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Problem Section ===== */}
      {/* Requirement #2: Explanation of the selected Sri Lankan problem */}
      <section className="section problem-section" id="problem-section">
        <div className="container">
          <div className="problem-grid" ref={addRef} style={{ opacity: 1 }}>
            <div className="problem-content">
              <h2>
                The <span className="gradient-text-warm">Problem</span> We're Solving
              </h2>
              <p>
                Sri Lanka has a wealth of skilled individuals — artisans, teachers,
                farmers, tech professionals — but <strong>no easy way to connect</strong> those
                who know with those who want to learn.
              </p>
              <p>
                Rural communities are hit hardest. A student in Batticaloa who wants
                to learn web development, or a young woman in Ratnapura who wants to
                learn sewing, often has <strong>no access to mentors</strong> in their area.
              </p>
              <p>
                Meanwhile, thousands of skilled Sri Lankans are willing to teach but
                have <strong>no platform to reach learners</strong>. This gap in education
                access holds back communities across the island.
              </p>
            </div>

            <div className="problem-stats">
              <div className="problem-stat-card glass-card">
                <span className="stat-value gradient-text">46%</span>
                <span className="stat-label">of rural youth lack access to skill development programs</span>
              </div>
              <div className="problem-stat-card glass-card">
                <span className="stat-value gradient-text">72%</span>
                <span className="stat-label">of small-scale artisans have no digital presence</span>
              </div>
              <div className="problem-stat-card glass-card">
                <span className="stat-value gradient-text">3.2M</span>
                <span className="stat-label">youth aged 15-29 seeking vocational skills</span>
              </div>
              <div className="problem-stat-card glass-card">
                <span className="stat-value gradient-text">18%</span>
                <span className="stat-label">of graduates find jobs matching their skills</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section className="section" id="features-section">
        <div className="container">
          <h2 className="section-title" ref={addRef} className="section-title animate-on-scroll">
            How <span className="gradient-text">E-Pedia</span> Works
          </h2>
          <p className="section-subtitle">
            Three simple steps to bridge the knowledge gap in Sri Lanka
          </p>

          <div className="features-grid">
            <div className="feature-card glass-card" ref={addRef}>
              <div className="feature-icon">
                <Search size={28} />
              </div>
              <h3>Discover Mentors</h3>
              <p>
                Browse and search skilled individuals by category, location,
                and experience level. Find the perfect mentor near you.
              </p>
            </div>

            <div className="feature-card glass-card" ref={addRef}>
              <div className="feature-icon">
                <BookOpen size={28} />
              </div>
              <h3>Learn Anything</h3>
              <p>
                From traditional crafts to modern technology, languages to
                agriculture — learn directly from experienced practitioners.
              </p>
            </div>

            <div className="feature-card glass-card" ref={addRef}>
              <div className="feature-icon">
                <Users size={28} />
              </div>
              <h3>Share Your Skills</h3>
              <p>
                Register as a mentor in minutes. List your expertise, set your
                availability, and start making a difference in your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Featured Mentors Section ===== */}
      <section className="section" style={{ background: 'var(--bg-darker)', borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)' }} id="featured-mentors">
        <div className="container">
          <h2 className="section-title">
            Featured <span className="gradient-text">Mentors</span>
          </h2>
          <p className="section-subtitle">
            Meet some of the incredible Sri Lankans sharing their knowledge on E-Pedia
          </p>

          <div className="mentors-grid">
            {featuredMentors.map(mentor => (
              <SkillCard key={mentor.id} mentor={mentor} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/explore" className="btn btn-secondary btn-lg" id="view-all-mentors-btn">
              View All Mentors
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Value / Impact Section ===== */}
      {/* Requirement #10: Demonstration of the solution's value to Sri Lankan users */}
      <section className="section" id="impact-section">
        <div className="container">
          <h2 className="section-title">
            Why <span className="gradient-text">E-Pedia</span> Matters
          </h2>
          <p className="section-subtitle">
            Our platform creates real impact for Sri Lankan communities
          </p>

          <div className="features-grid">
            <div className="feature-card glass-card" ref={addRef}>
              <div className="feature-icon">
                <TrendingUp size={28} />
              </div>
              <h3>Economic Empowerment</h3>
              <p>
                Skilled mentors can earn income by teaching, while learners gain
                employable skills — creating a cycle of economic growth.
              </p>
            </div>

            <div className="feature-card glass-card" ref={addRef}>
              <div className="feature-icon">
                <Shield size={28} />
              </div>
              <h3>Preserving Heritage</h3>
              <p>
                Traditional crafts, Ayurvedic knowledge, and cultural practices
                are preserved by passing them to the next generation.
              </p>
            </div>

            <div className="feature-card glass-card" ref={addRef}>
              <div className="feature-icon">
                <Lightbulb size={28} />
              </div>
              <h3>Bridging the Digital Divide</h3>
              <p>
                By connecting rural mentors with urban learners and vice versa,
                we break down geographical barriers to education.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="section" style={{ background: 'var(--bg-darker)', borderTop: '1px solid var(--border-glass)' }} id="cta-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">
            Ready to <span className="gradient-text">Make a Difference?</span>
          </h2>
          <p className="section-subtitle">
            Join E-Pedia today and be part of Sri Lanka's knowledge revolution.
            Every skill shared is a life transformed.
          </p>
          <div className="hero-actions">
            <Link to="/teach" className="btn btn-accent btn-lg" id="cta-teach-btn">
              Share Your Skill
              <ArrowRight size={20} />
            </Link>
            <Link to="/explore" className="btn btn-secondary btn-lg" id="cta-explore-btn">
              <Search size={20} />
              Find a Mentor
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
