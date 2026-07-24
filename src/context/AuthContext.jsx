// src/context/AuthContext.jsx
//
// Context solves a specific problem: data that many components need
// but aren't directly related to each other.
//
// Without context, we'd have to pass `user` as a prop through every
// component in the tree — App → Navbar, App → VerseList, etc.
// That's called "prop drilling" and it gets messy fast.
//
// With context, any component can reach in and grab `user` directly
// without it being passed down manually.

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// Step 1: Create the context object.
// Think of it as an empty container we'll fill with auth data.
const AuthContext = createContext(null)

// Step 2: AuthProvider is a component that wraps the app.
// It owns the auth state and makes it available to everything inside it.
export function AuthProvider({ children }) {
  // `user` is the logged in Supabase user object, or null if logged out.
  const [user, setUser] = useState(null)

  // `loading` prevents the app from rendering before we know
  // if the user is logged in. Without this, protected pages would
  // flash briefly before redirecting to login.
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // --- Check current session on mount ---
    // When the app loads, ask Supabase if there's already a logged in user.
    // This handles page refreshes — Supabase stores the session in
    // localStorage and restores it automatically.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // --- Listen for auth changes ---
    // This fires whenever the user logs in or out.
    // We update our state to match so the whole app reacts.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    // Cleanup: unsubscribe when the component unmounts
    // to avoid memory leaks.
    return () => subscription.unsubscribe()
  }, [])
  // The empty [] means this effect runs once on mount — same idea
  // as useState(getVerses) lazy initialization we learned earlier.

  // --- Auth helper functions ---
  // We define these here and pass them through context so any
  // component can call them without importing supabase directly.

  async function signUp(email, password, metadata) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
    return { error }
  }

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  // Step 3: Provide the value.
  // Everything inside <AuthProvider> can access these values
  // via useAuth() — the hook we export below.
  const value = { user, loading, signUp, signIn, signOut }

  return (
    <AuthContext.Provider value={value}>
      {/*
        Don't render children until we know the auth state.
        This prevents a flash of the wrong page on load.
      */}
      {!loading && children}
    </AuthContext.Provider>
  )
}

// Step 4: Custom hook — useAuth()
// This is what components call to access auth state.
// It's cleaner than writing useContext(AuthContext) everywhere.
//
// Usage in any component:
//   const { user, signOut } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}
