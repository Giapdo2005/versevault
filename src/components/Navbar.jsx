import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'

function Navbar() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>VerseVault</Link>
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
