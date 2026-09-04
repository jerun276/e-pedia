import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../firebase/AuthContext'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isLoggedIn, userProfile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/auth"
        state={{ from: location.pathname, message: 'Please sign in to access this page.' }}
        replace
      />
    )
  }

  const role = userProfile?.role || 'learner'

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <Navigate
        to="/"
        state={{ message: 'Unauthorized: You do not have permission to view this page.' }}
        replace
      />
    )
  }

  return children
}
