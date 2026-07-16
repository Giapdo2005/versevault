// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import AddVerse from './pages/AddVerse'
import VerseList from './pages/VerseList'
import Practice from './pages/Practice'

function App() {
  return (
    // AuthProvider wraps everything so every component below
    // can access auth state via useAuth()
    <AuthProvider>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public routes — anyone can visit */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Protected routes — must be logged in */}
            <Route path="/verses" element={
              <ProtectedRoute><VerseList /></ProtectedRoute>
            } />
            <Route path="/add" element={
              <ProtectedRoute><AddVerse /></ProtectedRoute>
            } />
            <Route path="/practice/:id" element={
              <ProtectedRoute><Practice /></ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App
