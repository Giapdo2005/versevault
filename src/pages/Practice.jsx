// src/pages/Practice.jsx
//
// Updated for spaced repetition:
//   - 4 rating buttons instead of 2 (Again, Hard, Good, Easy)
//   - calculateNextReview computes the next interval
//   - logReview saves the session history
//   - updateVerse saves the new state back to Supabase

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getVerses, updateVerse, logReview } from '../data/verses'
import { calculateNextReview } from '../lib/spacedRepetition'
import styles from './Practice.module.css'

// Rating config — label, description, and value for each button.
// Keeping this as a constant outside the component means it's
// created once, not re-created on every render.
const RATINGS = [
  { value: 1, label: 'Again',  description: 'Complete blank',      className: 'ratingAgain'  },
  { value: 2, label: 'Hard',   description: 'Struggled a lot',     className: 'ratingHard'   },
  { value: 3, label: 'Good',   description: 'Recalled with effort', className: 'ratingGood'   },
  { value: 4, label: 'Easy',   description: 'Perfect recall',      className: 'ratingEasy'   },
]

function Practice() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [verse, setVerse]       = useState(null)
  const [loading, setLoading]   = useState(true)
  const [revealed, setRevealed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchVerse() {
      try {
        const data  = await getVerses()
        const found = data.find((v) => v.id === id)
        setVerse(found || null)
      } finally {
        setLoading(false)
      }
    }
    fetchVerse()
  }, [id])

  function renderHiddenText(text) {
    return text.split(' ').map((word, index) => (
      <span key={index} className={styles.blank}>
        {'_'.repeat(word.length)}
      </span>
    ))
  }

  // --- handleRate ---
  // Called when the user clicks any of the 4 rating buttons.
  // 1. Calculate the new interval using SM-2
  // 2. Save updated verse state to Supabase
  // 3. Log this review to the reviews table
  // 4. Navigate back to verse list
  async function handleRate(rating) {
    setSubmitting(true)

    try {
      // Run the algorithm — returns updated fields
      const updates = calculateNextReview(verse, rating)

      // Save new state and log history in parallel.
      // Promise.all runs both at the same time instead of one after
      // the other — faster, and both must succeed or we catch the error.
      await Promise.all([
        updateVerse(id, updates),
        logReview(id, rating, updates.interval, updates.ease_factor),
      ])

      navigate('/verses')
    } catch (err) {
      console.error('Failed to save review:', err)
      setSubmitting(false)
    }
  }

  if (loading)  return <div className={styles.page}><p>Loading...</p></div>
  if (!verse)   return <div className={styles.page}><p className={styles.notFound}>Verse not found.</p></div>

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <p className={styles.eyebrow}>Practice</p>
        <h1 className={styles.reference}>{verse.reference}</h1>
        <p className={styles.hint}>
          {revealed ? 'How well did you recall it?' : 'Recite the verse, then reveal.'}
        </p>
      </div>

      <div className={styles.card}>
        <div className={styles.verseText}>
          {revealed ? verse.text : renderHiddenText(verse.text)}
        </div>
      </div>

      {!revealed ? (
        <button
          className={styles.revealButton}
          onClick={() => setRevealed(true)}
        >
          Reveal verse
        </button>
      ) : (
        <div className={styles.ratingSection}>
          <p className={styles.ratingLabel}>Rate your recall:</p>
          <div className={styles.ratingRow}>
            {RATINGS.map((r) => (
              <button
                key={r.value}
                className={`${styles.ratingButton} ${styles[r.className]}`}
                onClick={() => handleRate(r.value)}
                disabled={submitting}
              >
                <span className={styles.ratingName}>{r.label}</span>
                <span className={styles.ratingDesc}>{r.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

export default Practice
