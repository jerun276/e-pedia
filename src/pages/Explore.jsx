import { useState, useMemo, useEffect } from 'react'
import { Search, SlidersHorizontal, Frown, GraduationCap } from 'lucide-react'
import SkillCard from '../components/SkillCard'
import { sampleMentors, categories, districts, experienceLevels } from '../data/sampleData'
import { useAuth } from '../firebase/AuthContext'
import { db, isFirebaseConfigured } from '../firebase/config'
import { collection, getDocs } from 'firebase/firestore'

function Explore() {
  const { userProfile, isLearner } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [customMentors, setCustomMentors] = useState([])

  // Load newly created mentors from localStorage and Firestore
  useEffect(() => {
    try {
      const stored = localStorage.getItem('epedia_custom_mentors')
      if (stored) {
        setCustomMentors(JSON.parse(stored))
      }
    } catch (e) {
      console.warn('Error reading cached mentors:', e)
    }

    if (isFirebaseConfigured && db) {
      getDocs(collection(db, 'mentors'))
        .then(snapshot => {
          const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
          if (docs.length > 0) {
            setCustomMentors(prev => {
              const combined = [...docs, ...prev]
              // Unique by id or email
              const seen = new Set()
              return combined.filter(item => {
                const key = item.id || item.email
                if (seen.has(key)) return false
                seen.add(key)
                return true
              })
            })
          }
        })
        .catch(err => console.warn('Firestore fetch mentors warning:', err.message))
    }
  }, [])

  // Combine live mentors with initial sample data
  const allMentors = useMemo(() => {
    return [...customMentors, ...sampleMentors]
  }, [customMentors])

  // Requirement #6: Display, search, filter information
  const filteredMentors = useMemo(() => {
    return allMentors.filter(mentor => {
      const matchesSearch = searchQuery === '' ||
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === '' || mentor.category === selectedCategory
      const matchesDistrict = selectedDistrict === '' || mentor.district === selectedDistrict
      const matchesLevel = selectedLevel === '' || mentor.experienceLevel === selectedLevel

      return matchesSearch && matchesCategory && matchesDistrict && matchesLevel
    })
  }, [allMentors, searchQuery, selectedCategory, selectedDistrict, selectedLevel])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedDistrict('')
    setSelectedLevel('')
  }

  const hasActiveFilters = searchQuery || selectedCategory || selectedDistrict || selectedLevel

  return (
    <main className="explore-page" id="explore-page">
      <div className="container">
        <div className="form-header" style={{ marginBottom: 32 }}>
          {isLearner && userProfile && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(108, 99, 255, 0.12)',
              border: '1px solid rgba(108, 99, 255, 0.25)',
              color: 'var(--primary-light)',
              fontSize: '0.85rem',
              marginBottom: '12px'
            }}>
              <GraduationCap size={16} /> Welcome, {userProfile.name} • Student ID: {userProfile.studentId || 'Verified'}
            </div>
          )}

          <h1>
            Explore <span className="gradient-text">Mentors</span>
          </h1>
          <p>
            Discover skilled Sri Lankans ready to share their knowledge with you
          </p>
        </div>

        {/* Search & Filters */}
        <div className="search-section" id="search-section">
          <div className="search-bar">
            <div className="search-input-wrapper">
              <Search size={20} />
              <input
                type="text"
                className="search-input"
                placeholder="Search by name, skill, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="search-input"
              />
            </div>

            <select
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              id="filter-category"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              className="filter-select"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              id="filter-district"
            >
              <option value="">All Districts</option>
              {districts.map(dist => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>

            <select
              className="filter-select"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              id="filter-level"
            >
              <option value="">All Levels</option>
              {experienceLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="results-count" id="results-count">
          Showing <span>{filteredMentors.length}</span> of {sampleMentors.length} mentors
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="btn btn-sm"
              style={{
                marginLeft: 12,
                padding: '4px 14px',
                fontSize: '0.8rem',
                background: 'var(--bg-card)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-full)'
              }}
              id="clear-filters-btn"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Results Grid */}
        {filteredMentors.length > 0 ? (
          <div className="mentors-grid" id="mentors-grid">
            {filteredMentors.map(mentor => (
              <SkillCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        ) : (
          <div className="no-results" id="no-results">
            <Frown size={56} />
            <h3>No mentors found</h3>
            <p>Try adjusting your search or filters to find more mentors.</p>
            <button
              onClick={clearFilters}
              className="btn btn-secondary"
              style={{ marginTop: 16 }}
            >
              <SlidersHorizontal size={18} />
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

export default Explore
