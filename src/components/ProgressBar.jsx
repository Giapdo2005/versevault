// src/components/ProgressBar.jsx
//
// Displays a visual breakdown of verse statuses.
// Receives the full verses array as a prop and calculates
// its own counts — VerseList doesn't need to know the math.

import styles from './ProgressBar.module.css'

function ProgressBar({ verses }) {
  // --- Count each status ---
  // .filter() returns a new array of only matching items.
  // .length gives us the count.
  const total       = verses.length
  const needToLearn = verses.filter(v => v.status === 'needToLearn').length
  const learning    = verses.filter(v => v.status === 'learning').length
  const mastered    = verses.filter(v => v.status === 'mastered').length

  // Guard: if no verses yet, don't render anything
  if (total === 0) return null

  // --- Calculate percentages ---
  // Each segment width is proportional to its share of the total.
  const needToLearnPct = (needToLearn / total) * 100
  const learningPct    = (learning    / total) * 100
  const masteredPct    = (mastered    / total) * 100

  return (
    <div className={styles.wrapper}>

      {/* --- Stat chips --- */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statDot} data-status="needToLearn" />
          <span className={styles.statLabel}>Need to learn</span>
          <span className={styles.statCount}>{needToLearn}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statDot} data-status="learning" />
          <span className={styles.statLabel}>Still learning</span>
          <span className={styles.statCount}>{learning}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statDot} data-status="mastered" />
          <span className={styles.statLabel}>Mastered</span>
          <span className={styles.statCount}>{mastered}</span>
        </div>
      </div>

      {/* --- Progress bar ---
          Three segments sit side by side inside one track.
          Each segment's width is set via an inline style — we use
          inline style here (not CSS module) because the value is
          dynamic (calculated at runtime). CSS modules are for
          static styles only.
      */}
      <div className={styles.track}>
        <div
          className={`${styles.segment} ${styles.segmentNeedToLearn}`}
          style={{ width: `${needToLearnPct}%` }}
        />
        <div
          className={`${styles.segment} ${styles.segmentLearning}`}
          style={{ width: `${learningPct}%` }}
        />
        <div
          className={`${styles.segment} ${styles.segmentMastered}`}
          style={{ width: `${masteredPct}%` }}
        />
      </div>

      {/* --- Total count --- */}
      <p className={styles.total}>{total} {total === 1 ? 'verse' : 'verses'} total</p>

    </div>
  )
}

export default ProgressBar
