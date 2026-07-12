/* src/components/Navbar.jsx
 *
 * The Navbar appears at the top of every page.
 * It shows the app name and navigation links.
 *
 * We use <Link> from react-router-dom instead of <a href>.
 * Why? <a href> causes a full page reload. <Link> updates the URL
 * and swaps the page component without reloading — much faster.
 */

import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'

function Navbar() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>

        {/* The logo/brand — clicking it goes home */}
        <Link to="/" className={styles.brand}>
          VerseVault
        </Link>

        {/* Navigation links — we'll add more as features are built */}
        <nav className={styles.nav}>
          <Link to="/" className={styles.link}>Home</Link>
          <Link to="/verses" className={styles.link}>My Verses</Link>
          <Link to="/add" className={styles.link}>+ Add</Link>
        </nav>

      </div>
    </header>
  )
}

export default Navbar
