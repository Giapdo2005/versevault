// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Navbar.module.css";

function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.user_metadata?.firstName;
  const lastName = user?.user_metadata?.lastName;

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          VerseVault
        </Link>

        <nav className={styles.nav}>
          {user ? (
            // Logged in — show app links and logout
            <>
              <Link to="/verses" className={styles.link}>
                My Verses
              </Link>
              <Link to="/add" className={styles.link}>
                + Add
              </Link>
              <span className={styles.email}>
                {firstName} {lastName}
              </span>
              <button className={styles.signOutButton} onClick={handleSignOut}>
                Sign out
              </button>
            </>
          ) : (
            // Logged out — show login link only
            <Link to="/login" className={styles.link}>
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
