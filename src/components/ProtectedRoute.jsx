import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/" replace />
  }

  // If token exists, show the page
  return children
}
