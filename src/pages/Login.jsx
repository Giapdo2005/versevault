// src/pages/Login.jsx
//
// Handles both login and signup in one page.
// A toggle switches between the two modes.
// On success, Supabase fires onAuthStateChange in AuthContext
// which updates user state — ProtectedRoutes then let the user through.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Login.module.css";

function Login() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  // `mode` toggles between 'login' and 'signup'
  const [mode, setMode] = useState("login");

  // TODO(you): this form now needs to collect a name too — add the right keys
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Call either signIn or signUp depending on current mode.
    // Both return { error } — if error is null, it succeeded.
    // TODO(you): signUp now takes a third argument — the metadata object
    // AuthContext passes through to Supabase's `options.data`. What goes here?
    const { error } =
      mode === "login"
        ? await signIn(formData.email, formData.password)
        : await signUp(formData.email, formData.password, {
            firstName: formData.firstName,
            lastName: formData.lastName,
          });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // On success, navigate to the verse list.
    // AuthContext's onAuthStateChange already updated user state,
    // so ProtectedRoute will let them through.
    navigate("/verses");
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {mode === "login" ? "Welcome back." : "Create an account."}
          </h1>
          <p className={styles.subtitle}>
            {mode === "login"
              ? "Sign in to access your verses."
              : "Start memorizing scripture today."}
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="firstName">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className={styles.input}
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="lastName">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className={styles.input}
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={styles.input}
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>

        {/* Toggle between login and signup */}
        <p className={styles.toggle}>
          {mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            className={styles.toggleButton}
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
            }}
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
