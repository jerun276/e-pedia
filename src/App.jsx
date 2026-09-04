import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './firebase/AuthContext'
import AuthBar from './firebase/AuthBar'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Explore from './pages/Explore'
import TeachForm from './pages/TeachForm'
import About from './pages/About'
import Profile from './pages/Profile'
import AiQuiz from './pages/AiQuiz'
import AdminDashboard from './pages/AdminDashboard'
import Auth from './pages/Auth'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <header className="app-header-fixed">
        <AuthBar />
        <Navbar />
      </header>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/quiz" element={<AiQuiz />} />
        <Route path="/teach" element={<TeachForm />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
      </Routes>
      <Footer />
    </AuthProvider>
  )
}


export default App

