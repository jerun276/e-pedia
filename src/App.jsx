import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './firebase/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

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
        <Navbar />
      </header>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/about" element={<About />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />

        {/* Protected Routes (Registered Users Only) */}
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <AiQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teach"
          element={
            <ProtectedRoute allowedRoles={['teacher', 'admin', 'learner']}>
              <TeachForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </AuthProvider>
  )
}

export default App
