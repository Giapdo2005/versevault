import { useNavigate } from 'react-router-dom'
import styles from './Home.module.css'

function Home() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Scripture Memory</p>
        <h1 className={styles.title}>Hide God's Word<br />in your heart.</h1>
        <p className={styles.subtitle}>
          One verse at a time. No pressure. Just practice.
        </p>
        <button className={styles.ctaButton} onClick={() => navigate('/add')}>
          Add your first verse →
        </button>
      </section>

      <section className={styles.sampleCard}>
        <p className={styles.verseText}>
          "Your word is a lamp to my feet and a light to my path."
        </p>
        <p className={styles.verseRef}>— Psalm 119:105, ESV</p>
      </section>
    </div>
  )
}

export default Home
