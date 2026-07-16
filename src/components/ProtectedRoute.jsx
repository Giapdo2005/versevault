// src/components/ProtectedRoute.jsx
//
// A wrapper component that checks if the user is logged in.
// If yes — render the page they asked for.
// If no — redirect them to /login automatically.
//
// We wrap any route we want to protect in App.jsx like this:
//   <Route path="/verses" element={<ProtectedRoute><VerseList /></ProtectedRoute>} />

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { user } = useAuth()

  // If no user is logged in, redirect to login page.
  // `replace` means this redirect replaces the history entry —
  // so pressing Back doesn't loop them back to the protected page.
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // User is logged in — render whatever page was requested.
  return children
}

export default ProtectedRoute
