import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, Frown, X } from 'lucide-react'
import SkillCard from '../components/SkillCard'
import { sampleMentors, categories, districts, experienceLevels } from '../data/sampleData'

function Explore() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [sortBy, setSortBy] = useState('relevance')

  // Requirement #6: Display, search, filter information
  const filteredMentors = useMemo(() => {
    const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean)
    const results = sampleMentors.filter(mentor => {
      const searchableContent = [
        mentor.name,
        mentor.skill,
        mentor.category,
        mentor.district,
        mentor.experienceLevel,
        mentor.description,
        ...mentor.availability
      ].join(' ').toLowerCase()
      const matchesSearch = searchTerms.every(term => searchableContent.includes(term))

      const matchesCategory = selectedCategory === '' || mentor.category === selectedCategory
      const matchesDistrict = selectedDistrict === '' || mentor.district === selectedDistrict
      const matchesLevel = selectedLevel === '' || mentor.experienceLevel === selectedLevel

      return matchesSearch && matchesCategory && matchesDistrict && matchesLevel
    })

    return [...results].sort((firstMentor, secondMentor) => {
      if (sortBy === 'rating') return secondMentor.rating - firstMentor.rating
      if (sortBy === 'students') return secondMentor.studentsHelped - firstMentor.studentsHelped
      if (sortBy === 'newest') return new Date(secondMentor.createdAt) - new Date(firstMentor.createdAt)
      if (searchTerms.length === 0) return 0

      const score = (mentor) => searchTerms.reduce((total, term) => {
        const nameMatch = mentor.name.toLowerCase().includes(term)
        const skillMatch = mentor.skill.toLowerCase().includes(term)
        const categoryMatch = mentor.category.toLowerCase().includes(term)
        return total + (nameMatch ? 4 : 0) + (skillMatch ? 3 : 0) + (categoryMatch ? 2 : 0)
      }, 0)
      return score(secondMentor) - score(firstMentor)
    })
  }, [searchQuery, selectedCategory, selectedDistrict, selectedLevel, sortBy])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedDistrict('')
    setSelectedLevel('')
    setSortBy('relevance')
  }

  const activeFilters = [
    searchQuery ? `Search: ${searchQuery}` : '',
    selectedCategory,
    selectedDistrict,
    selectedLevel
  ].filter(Boolean)
  const hasActiveFilters = activeFilters.length > 0

  return (
    <main className="explore-page" id="explore-page">
      <div className="container">
        <div className="form-header" style={{ marginBottom: 32 }}>
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

            <label className="sr-only" htmlFor="filter-category">Filter by category</label>
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

            <label className="sr-only" htmlFor="filter-district">Filter by district</label>
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

            <label className="sr-only" htmlFor="filter-level">Filter by experience level</label>
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

            <label className="sr-only" htmlFor="sort-results">Sort mentors</label>
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              id="sort-results"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="rating">Sort: Highest rated</option>
              <option value="students">Sort: Most experienced</option>
              <option value="newest">Sort: Newest profiles</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="results-count" id="results-count">
          Showing <span>{filteredMentors.length}</span> of {sampleMentors.length} mentors
          {hasActiveFilters && (
            <>
              <div className="active-filter-list" aria-label="Active filters">
                {activeFilters.map(filter => <span className="active-filter" key={filter}>{filter}</span>)}
              </div>
              <button onClick={clearFilters} className="btn btn-sm clear-filters-button" id="clear-filters-btn">
                <X size={14} /> Clear filters
              </button>
            </>
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
