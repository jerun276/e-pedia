import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  BookOpen,
  CheckCircle,
  XCircle,
  Award,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Search,
  Clock,
  Zap,
  TrendingUp,
  UserCheck,
  HelpCircle,
  ChevronRight
} from 'lucide-react'
import { generateQuiz, analyzeQuizResults } from '../services/aiService'

const SUGGESTED_TOPICS = [
  'React & Web Development',
  'Python Programming',
  'Sri Lankan History & Heritage',
  'O/L Physics & Science',
  'English Grammar & Vocabulary',
  'Digital Marketing',
  'Data Structures & Algorithms',
  'Graphic Design Principles'
]

function AiQuiz() {
  // Setup State
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('Intermediate')
  const [numQuestions, setNumQuestions] = useState(5)
  const [loading, setLoading] = useState(false)

  // Active Quiz State
  const [quiz, setQuiz] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [selectedOption, setSelectedOption] = useState(null)

  // Timer State
  const [timeSpent, setTimeSpent] = useState(0)
  const [timerActive, setTimerActive] = useState(false)

  // Results State
  const [results, setResults] = useState(null)
  const [quizProgress, setQuizProgress] = useState(() => {
    const savedProgress = localStorage.getItem('e-pedia-quiz-progress')
    return savedProgress ? JSON.parse(savedProgress) : { qualifiedQuizzes: 0 }
  })

  // Timer effect
  useEffect(() => {
    let interval = null
    if (timerActive) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [timerActive])

  // Start Quiz
  const handleStartQuiz = async (selectedTopic = topic) => {
    const finalTopic = selectedTopic.trim()
    if (!finalTopic) return

    setLoading(true)
    setResults(null)
    setUserAnswers({})
    setSelectedOption(null)
    setCurrentStep(0)
    setTimeSpent(0)

    try {
      const generated = await generateQuiz(finalTopic, difficulty, numQuestions)
      setQuiz(generated)
      setTimerActive(true)
    } catch (err) {
      console.error('Quiz generation failed:', err)
    } finally {
      setLoading(false)
    }
  }

  // Answer selection
  const handleSelectOption = (index) => {
    setSelectedOption(index)
    setUserAnswers(prev => ({
      ...prev,
      [currentStep]: index
    }))
  }

  // Next Question
  const handleNextQuestion = () => {
    if (currentStep < quiz.questions.length - 1) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      setSelectedOption(userAnswers[nextStep] !== undefined ? userAnswers[nextStep] : null)
    } else {
      handleFinishQuiz()
    }
  }

  // Finish Quiz
  const handleFinishQuiz = () => {
    setTimerActive(false)
    const analysis = analyzeQuizResults(quiz, userAnswers, timeSpent)
    setResults(analysis)
    if (analysis.percentage >= 80) {
      const updatedProgress = { qualifiedQuizzes: quizProgress.qualifiedQuizzes + 1 }
      setQuizProgress(updatedProgress)
      localStorage.setItem('e-pedia-quiz-progress', JSON.stringify(updatedProgress))
    }
  }

  // Reset Quiz
  const handleReset = () => {
    setQuiz(null)
    setResults(null)
    setCurrentStep(0)
    setUserAnswers({})
    setSelectedOption(null)
    setTimeSpent(0)
  }

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <main className="ai-quiz-page" id="ai-quiz-page" style={{ padding: '60px 0', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="badge badge-primary" style={{ marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} /> Powered by AI Assistant
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '12px' }}>
            AI Quiz & Learning Assistant
          </h1>
          <p className="text-secondary" style={{ maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem' }}>
            Tell the AI any topic you want to learn or test your knowledge on. Get an instant custom quiz, 
            detailed score evaluation, and personalized <strong style={{ color: 'var(--accent-primary)' }}>"Areas to Master"</strong> analysis.
          </p>
        </div>

        {/* STEP 1: GENERATOR SETUP FORM */}
        {!quiz && !loading && (
          <div className="card glass-card" style={{ padding: '32px', borderRadius: '16px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={20} className="text-primary" /> 1. Choose or Enter a Topic
            </h2>

            <form onSubmit={(e) => { e.preventDefault(); handleStartQuiz(); }}>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">What topic do you want to learn or quiz yourself on?</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. React Hooks, O/L Chemistry, Python Loops, Sri Lankan History..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    style={{ paddingLeft: '44px', fontSize: '1.05rem' }}
                    required
                  />
                  <Search size={20} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                </div>
              </div>

              {/* SUGGESTED CHIPS */}
              <div style={{ marginBottom: '28px' }}>
                <label className="form-label" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Popular Suggested Topics:</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                  {SUGGESTED_TOPICS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        padding: '6px 14px',
                        borderColor: topic === item ? 'var(--primary)' : 'var(--border-glass)',
                        background: topic === item ? 'rgba(108, 99, 255, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                        color: topic === item ? '#ffffff' : 'var(--text-primary)',
                        cursor: 'pointer',
                        fontWeight: topic === item ? '600' : '500',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => {
                        setTopic(item)
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* CONFIGURATION OPTIONS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '28px' }}>
                <div>
                  <label className="form-label">Difficulty Level</label>
                  <select
                    className="form-input"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Number of Questions</label>
                  <select
                    className="form-input"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                  >
                    <option value={5}>5 Questions (Quick Quiz)</option>
                    <option value={10}>10 Questions (Standard Test)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                disabled={!topic.trim()}
              >
                <Sparkles size={20} /> Generate AI Quiz Now
              </button>
            </form>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="card glass-card" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: '16px' }}>
            <div className="spinner" style={{ width: '48px', height: '48px', margin: '0 auto 20px', borderTopColor: 'var(--accent-primary)' }}></div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px' }}>AI is Crafting Your Custom Quiz...</h3>
            <p className="text-secondary">Analyzing topic parameters, formatting distractor choices, and crafting detailed explanations.</p>
          </div>
        )}

        {/* STEP 2: ACTIVE QUIZ VIEW */}
        {quiz && !results && (
          <div className="card glass-card" style={{ padding: '32px', borderRadius: '16px' }}>
            
            {/* TOP BAR */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <span className="badge badge-primary" style={{ marginRight: '8px' }}>{quiz.difficulty}</span>
                <span className="text-secondary" style={{ fontSize: '0.9rem', fontWeight: '600' }}>Topic: {quiz.topic}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', fontWeight: '600' }}>
                <Clock size={18} /> {formatTime(timeSpent)}
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px', fontWeight: '600' }}>
                <span>Question {currentStep + 1} of {quiz.questions.length}</span>
                <span>{Math.round(((currentStep + 1) / quiz.questions.length) * 100)}% Completed</span>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${((currentStep + 1) / quiz.questions.length) * 100}%`,
                    height: '100%',
                    background: 'var(--gradient-primary)',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>

            {/* QUESTION CONTENT */}
            {quiz.questions[currentStep] && (
              <div>
                <div style={{ marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', tracking: '1px', color: 'var(--accent-primary)', fontWeight: '700' }}>
                    Subtopic: {quiz.questions[currentStep].subtopic}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '24px', lineHeight: '1.5' }}>
                  {quiz.questions[currentStep].question}
                </h3>

                {/* OPTIONS LIST */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                  {quiz.questions[currentStep].options.map((opt, idx) => {
                    const isSelected = selectedOption === idx
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectOption(idx)}
                        style={{
                          textAlign: 'left',
                          padding: '14px 20px',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                          background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-tertiary)',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: isSelected ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                          color: isSelected ? '#fff' : 'var(--text-secondary)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '700',
                          fontSize: '0.85rem'
                        }}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    )
                  })}
                </div>

                {/* CONTROLS */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      if (currentStep > 0) {
                        const prev = currentStep - 1
                        setCurrentStep(prev)
                        setSelectedOption(userAnswers[prev] !== undefined ? userAnswers[prev] : null)
                      }
                    }}
                    disabled={currentStep === 0}
                  >
                    Previous
                  </button>

                  <button
                    className="btn btn-primary"
                    onClick={handleNextQuestion}
                    disabled={selectedOption === null}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    {currentStep === quiz.questions.length - 1 ? 'Finish & Analyze' : 'Next Question'}
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: AI RESULTS & AREAS TO MASTER DASHBOARD */}
        {results && (
          <div>
            {/* SCORE CARD */}
            <div className="card glass-card" style={{ padding: '36px', borderRadius: '16px', textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Award size={44} style={{ color: results.gradeColor }} />
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '4px' }}>
                {results.percentage}% Score ({results.score} / {results.totalQuestions})
              </h2>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: results.gradeColor, marginBottom: '12px' }}>
                Status: {results.grade}
              </div>
              {quizProgress.qualifiedQuizzes >= 5 && (
                <div className="recognition-badge learner-badge">
                  <Award size={17} /> Master Learner
                </div>
              )}
              <p className="text-secondary" style={{ maxWidth: '550px', margin: '0 auto 20px' }}>
                {results.summaryText} Time spent: {formatTime(results.timeSpentSeconds)}.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={() => handleStartQuiz(results.topic)}>
                  <RotateCcw size={18} style={{ marginRight: '6px' }} /> Retake Quiz
                </button>
                <button className="btn btn-outline" onClick={handleReset}>
                  Try Another Topic
                </button>
              </div>
            </div>

            {/* AI AREAS TO MASTER ANALYSIS */}
            <div className="card glass-card" style={{ padding: '32px', borderRadius: '16px', marginBottom: '28px', borderLeft: '4px solid var(--accent-amber)' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TrendingUp size={22} style={{ color: 'var(--accent-amber)' }} />
                AI Skill Gap Analysis: "Areas to Master"
              </h3>
              <p className="text-secondary" style={{ marginBottom: '20px', fontSize: '0.95rem' }}>
                Based on your answers, our AI assistant has identified the following specific concepts you should study further:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {results.areasToMaster.map((area, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '16px 20px',
                      borderRadius: '12px',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                        📍 {area.subtopic}
                      </span>
                      <span className="badge" style={{
                        background: area.accuracyPct === 100 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: area.accuracyPct === 100 ? 'var(--accent-emerald)' : 'var(--accent-amber)',
                        fontWeight: '700'
                      }}>
                        {area.accuracyPct}% Mastery
                      </span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                      💡 <strong>AI Recommendation:</strong> {area.advice}
                    </p>
                  </div>
                ))}
              </div>

              {/* CONNECT WITH MENTOR CTA */}
              <div style={{ marginTop: '24px', padding: '20px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserCheck size={18} className="text-primary" /> Want 1-on-1 Help Mastering These Topics?
                  </h4>
                  <p className="text-secondary" style={{ margin: 0, fontSize: '0.88rem' }}>
                    Connect with expert Sri Lankan mentors on E-Pedia specializing in {results.topic}.
                  </p>
                </div>
                <Link to="/explore" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                  Find Mentors for {results.topic} <ArrowRight size={16} style={{ marginLeft: '4px' }} />
                </Link>
              </div>
            </div>

            {/* DETAILED QUESTION BREAKDOWN */}
            <div className="card glass-card" style={{ padding: '32px', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '20px' }}>
                Question Breakdown & Explanations
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {results.breakdown.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '20px',
                      borderRadius: '12px',
                      background: 'var(--bg-tertiary)',
                      borderLeft: `4px solid ${item.isCorrect ? 'var(--accent-emerald)' : 'var(--text-danger)'}`
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
                      {item.isCorrect ? (
                        <CheckCircle size={22} style={{ color: 'var(--accent-emerald)', shrink: 0, marginTop: '2px' }} />
                      ) : (
                        <XCircle size={22} style={{ color: 'var(--text-danger)', shrink: 0, marginTop: '2px' }} />
                      )}
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: '700', textTransform: 'uppercase' }}>
                          Question {item.questionId} • {item.subtopic}
                        </span>
                        <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: '4px 0 8px 0', lineHeight: '1.4' }}>
                          {item.question}
                        </h4>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.9rem', marginBottom: '6px' }}>
                      <strong style={{ color: item.isCorrect ? 'var(--accent-emerald)' : 'var(--text-danger)' }}>Your Answer:</strong> {item.selectedOption}
                    </div>
                    {!item.isCorrect && (
                      <div style={{ fontSize: '0.9rem', color: 'var(--accent-emerald)', marginBottom: '8px' }}>
                        <strong>Correct Answer:</strong> {item.correctOption}
                      </div>
                    )}
                    <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                      💬 <strong>Explanation:</strong> {item.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  )
}

export default AiQuiz
