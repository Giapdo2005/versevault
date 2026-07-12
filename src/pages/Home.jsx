/* src/pages/Home.jsx
 *
 * The landing page. Right now it's a simple welcome screen.
 * As we add features, this will become a dashboard showing
 * the user's verse progress and what to review today.
 */

import styles from './Home.module.css'

function Home() {
  return (
    <div className={styles.page}>

      {/* Hero section — the first thing the user sees */}
      <section className={styles.hero}>
        <p className={styles.eyebrow}>ESV · Scripture Memory</p>
        <h1 className={styles.title}>Hide God's Word<br />in your heart.</h1>
        <p className={styles.subtitle}>
          One verse at a time. No pressure. Just practice.
        </p>

        {/* Placeholder — this button will navigate to Add Verse in Feature 2 */}
        <button className={styles.ctaButton} onClick={() => window.location.href = '/add'}>
          Add your first verse →
        </button>
      </section>

      {/* A sample verse card so we can see the design in action */}
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
